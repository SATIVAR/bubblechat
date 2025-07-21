import { lookup } from 'mime-types';
import { SupportedFileTypes, FileInfo } from '../types';

export class FileTypeDetector {
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  
  private static readonly SUPPORTED_EXTENSIONS = new Set([
    '.pdf', '.jpg', '.jpeg', '.png', '.tiff', '.tif', '.bmp', 
    '.xlsx', '.xls', '.csv'
  ]);

  static isSupported(mimeType: string): boolean {
    return Object.values(SupportedFileTypes).includes(mimeType as SupportedFileTypes);
  }

  static detectMimeType(fileName: string, buffer?: Buffer): string {
    // Primeiro tenta detectar pelo nome do arquivo
    const mimeFromName = lookup(fileName);
    if (mimeFromName) {
      return mimeFromName;
    }

    // Se tiver buffer, tenta detectar pela assinatura do arquivo
    if (buffer) {
      return this.detectFromBuffer(buffer);
    }

    throw new Error(`Não foi possível detectar o tipo do arquivo: ${fileName}`);
  }

  private static detectFromBuffer(buffer: Buffer): string {
    const header = buffer.subarray(0, 16);
    
    // PDF
    if (header.subarray(0, 4).toString() === '%PDF') {
      return SupportedFileTypes.PDF;
    }
    
    // JPEG
    if (header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF) {
      return SupportedFileTypes.JPEG;
    }
    
    // PNG
    if (header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) {
      return SupportedFileTypes.PNG;
    }
    
    // TIFF
    if ((header[0] === 0x49 && header[1] === 0x49 && header[2] === 0x2A && header[3] === 0x00) ||
        (header[0] === 0x4D && header[1] === 0x4D && header[2] === 0x00 && header[3] === 0x2A)) {
      return SupportedFileTypes.TIFF;
    }
    
    // BMP
    if (header[0] === 0x42 && header[1] === 0x4D) {
      return SupportedFileTypes.BMP;
    }
    
    // Excel XLSX (ZIP signature)
    if (header.subarray(0, 4).equals(Buffer.from([0x50, 0x4B, 0x03, 0x04]))) {
      return SupportedFileTypes.XLSX;
    }
    
    // Excel XLS
    if (header.subarray(0, 8).equals(Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]))) {
      return SupportedFileTypes.XLS;
    }

    throw new Error('Tipo de arquivo não suportado ou não reconhecido');
  }

  static validateFile(fileInfo: FileInfo): void {
    // Validar tamanho
    if (fileInfo.size > this.MAX_FILE_SIZE) {
      throw new Error(`Arquivo muito grande. Tamanho máximo: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Validar tipo
    if (!this.isSupported(fileInfo.mimeType)) {
      throw new Error(`Tipo de arquivo não suportado: ${fileInfo.mimeType}`);
    }

    // Validar extensão
    const extension = this.getFileExtension(fileInfo.originalName);
    if (!this.SUPPORTED_EXTENSIONS.has(extension.toLowerCase())) {
      throw new Error(`Extensão de arquivo não suportada: ${extension}`);
    }
  }

  private static getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot !== -1 ? fileName.substring(lastDot) : '';
  }

  static getProcessorType(mimeType: string): 'ocr' | 'pdf' | 'spreadsheet' {
    switch (mimeType) {
      case SupportedFileTypes.PDF:
        return 'pdf';
      case SupportedFileTypes.JPEG:
      case SupportedFileTypes.PNG:
      case SupportedFileTypes.TIFF:
      case SupportedFileTypes.BMP:
        return 'ocr';
      case SupportedFileTypes.XLSX:
      case SupportedFileTypes.XLS:
      case SupportedFileTypes.CSV:
        return 'spreadsheet';
      default:
        throw new Error(`Processador não encontrado para o tipo: ${mimeType}`);
    }
  }
}