import { 
  ProcessingResult, 
  ProcessingOptions, 
  FileInfo, 
  OCROptions, 
  PDFOptions, 
  SpreadsheetOptions 
} from './types';
import { FileTypeDetector } from './utils/fileTypeDetector';
import { OCRProcessor } from './processors/ocrProcessor';
import { PDFProcessor } from './processors/pdfProcessor';
import { SpreadsheetProcessor } from './processors/spreadsheetProcessor';
import { TextPreprocessor } from './processors/textPreprocessor';

export class DocumentProcessor {
  /**
   * Processa um documento e extrai seu texto
   */
  static async processDocument(
    fileInfo: FileInfo,
    options: ProcessingOptions = {}
  ): Promise<ProcessingResult> {
    try {
      // Validar arquivo
      FileTypeDetector.validateFile(fileInfo);

      // Detectar tipo de processador necessário
      const processorType = FileTypeDetector.getProcessorType(fileInfo.mimeType);

      let result: ProcessingResult;

      // Processar baseado no tipo
      switch (processorType) {
        case 'ocr':
          result = await OCRProcessor.processImage(fileInfo, options as OCROptions);
          break;
        
        case 'pdf':
          result = await PDFProcessor.processPDF(fileInfo, options as PDFOptions);
          break;
        
        case 'spreadsheet':
          result = await SpreadsheetProcessor.processSpreadsheet(fileInfo, options as SpreadsheetOptions);
          break;
        
        default:
          throw new Error(`Tipo de processador não suportado: ${processorType}`);
      }

      // Pós-processar texto se necessário
      if (result.success && result.text) {
        result.text = TextPreprocessor.formatForLLM(result.text);
      }

      return result;

    } catch (error) {
      return {
        success: false,
        text: '',
        metadata: {
          fileType: fileInfo.mimeType,
          fileName: fileInfo.originalName,
          fileSize: fileInfo.size,
          processingTime: 0
        },
        error: error instanceof Error ? error.message : 'Erro desconhecido no processamento'
      };
    }
  }

  /**
   * Processa múltiplos documentos em paralelo
   */
  static async processMultipleDocuments(
    files: FileInfo[],
    options: ProcessingOptions = {}
  ): Promise<ProcessingResult[]> {
    const promises = files.map(file => this.processDocument(file, options));
    return Promise.all(promises);
  }

  /**
   * Verifica se um tipo de arquivo é suportado
   */
  static isFileTypeSupported(mimeType: string): boolean {
    return FileTypeDetector.isSupported(mimeType);
  }

  /**
   * Obtém informações sobre um arquivo sem processá-lo
   */
  static async getFileInfo(fileInfo: FileInfo): Promise<any> {
    try {
      FileTypeDetector.validateFile(fileInfo);
      
      const processorType = FileTypeDetector.getProcessorType(fileInfo.mimeType);
      
      switch (processorType) {
        case 'pdf':
          return await PDFProcessor.extractMetadata(fileInfo.buffer);
        
        case 'spreadsheet':
          return await SpreadsheetProcessor.getSpreadsheetInfo(fileInfo.buffer, fileInfo.mimeType);
        
        default:
          return {
            type: processorType,
            mimeType: fileInfo.mimeType,
            size: fileInfo.size,
            name: fileInfo.originalName
          };
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Erro ao obter informações do arquivo'
      };
    }
  }

  /**
   * Extrai apenas palavras-chave de um documento
   */
  static async extractKeywords(
    fileInfo: FileInfo,
    maxKeywords: number = 10,
    options: ProcessingOptions = {}
  ): Promise<string[]> {
    const result = await this.processDocument(fileInfo, options);
    
    if (!result.success || !result.text) {
      return [];
    }

    return TextPreprocessor.extractKeywords(result.text, maxKeywords);
  }

  /**
   * Cria um resumo de um documento
   */
  static async summarizeDocument(
    fileInfo: FileInfo,
    maxSentences: number = 3,
    options: ProcessingOptions = {}
  ): Promise<string> {
    const result = await this.processDocument(fileInfo, options);
    
    if (!result.success || !result.text) {
      return '';
    }

    return TextPreprocessor.summarizeText(result.text, maxSentences);
  }

  /**
   * Compara similaridade entre dois documentos
   */
  static async compareDocuments(
    file1: FileInfo,
    file2: FileInfo,
    options: ProcessingOptions = {}
  ): Promise<number> {
    const [result1, result2] = await Promise.all([
      this.processDocument(file1, options),
      this.processDocument(file2, options)
    ]);

    if (!result1.success || !result2.success || !result1.text || !result2.text) {
      return 0;
    }

    return TextPreprocessor.calculateSimilarity(result1.text, result2.text);
  }
}