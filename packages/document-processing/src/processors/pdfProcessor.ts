import pdf from 'pdf-parse';
import { ProcessingResult, PDFOptions, FileInfo } from '../types';
import { OCRProcessor } from './ocrProcessor';

export class PDFProcessor {
  private static readonly DEFAULT_OPTIONS: PDFOptions = {
    language: 'por',
    preserveFormatting: true,
    maxPages: 100,
    includeMetadata: true,
    timeout: 120000, // 2 minutos
  };

  static async processPDF(
    fileInfo: FileInfo,
    options: PDFOptions = {}
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    try {
      // Extrair texto do PDF
      const data = await pdf(fileInfo.buffer, {
        max: opts.maxPages || 100,
      });

      let extractedText = data.text;
      let confidence = 100; // PDFs com texto têm alta confiança

      // Se o texto extraído for muito pequeno, pode ser um PDF escaneado
      if (this.isProbablyScannedPDF(extractedText, data.numpages)) {
        console.log('PDF parece ser escaneado, tentando OCR...');
        
        try {
          // Converter PDF para imagens e aplicar OCR
          const ocrResult = await this.processScannedPDF(fileInfo, opts);
          if (ocrResult.success && ocrResult.text.length > extractedText.length) {
            extractedText = ocrResult.text;
            confidence = ocrResult.metadata.confidence || 85;
          }
        } catch (ocrError) {
          console.warn('Falha no OCR do PDF escaneado:', ocrError);
          // Continua com o texto extraído originalmente
        }
      }

      // Pós-processar texto
      if (!opts.preserveFormatting) {
        extractedText = this.cleanText(extractedText);
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        text: extractedText,
        metadata: {
          fileType: fileInfo.mimeType,
          fileName: fileInfo.originalName,
          fileSize: fileInfo.size,
          processingTime,
          confidence,
          pageCount: data.numpages,
          language: opts.language || 'por'
        }
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      return {
        success: false,
        text: '',
        metadata: {
          fileType: fileInfo.mimeType,
          fileName: fileInfo.originalName,
          fileSize: fileInfo.size,
          processingTime,
          language: opts.language || 'por'
        },
        error: error instanceof Error ? error.message : 'Erro desconhecido no processamento do PDF'
      };
    }
  }

  private static isProbablyScannedPDF(text: string, pageCount: number): boolean {
    const textLength = text.trim().length;
    const avgCharsPerPage = textLength / pageCount;
    
    // Se há menos de 50 caracteres por página, provavelmente é escaneado
    return avgCharsPerPage < 50;
  }

  private static async processScannedPDF(
    fileInfo: FileInfo,
    options: PDFOptions
  ): Promise<ProcessingResult> {
    // Esta é uma implementação simplificada
    // Em produção, você usaria uma biblioteca como pdf2pic para converter PDF em imagens
    // e então aplicaria OCR em cada página
    
    console.log('Processamento de PDF escaneado não implementado completamente');
    console.log('Recomenda-se usar bibliotecas como pdf2pic + OCR para implementação completa');
    
    // Por enquanto, retorna um resultado vazio
    return {
      success: false,
      text: '',
      metadata: {
        fileType: fileInfo.mimeType,
        fileName: fileInfo.originalName,
        fileSize: fileInfo.size,
        processingTime: 0,
        language: options.language || 'por'
      },
      error: 'Processamento de PDF escaneado não implementado'
    };
  }

  private static cleanText(text: string): string {
    return text
      // Remover múltiplas quebras de linha
      .replace(/\n{3,}/g, '\n\n')
      // Remover espaços extras
      .replace(/[ \t]{2,}/g, ' ')
      // Remover caracteres de controle
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Normalizar quebras de linha
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remover espaços no início e fim das linhas
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      // Remover linhas vazias extras
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  static async extractMetadata(buffer: Buffer): Promise<any> {
    try {
      const data = await pdf(buffer);
      return {
        pages: data.numpages,
        info: data.info,
        metadata: data.metadata,
        version: data.version
      };
    } catch (error) {
      console.warn('Falha ao extrair metadados do PDF:', error);
      return null;
    }
  }
}