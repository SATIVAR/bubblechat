import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import { ProcessingResult, OCROptions, FileInfo } from '../types';

export class OCRProcessor {
  private static readonly DEFAULT_OPTIONS: OCROptions = {
    language: 'por',
    preserveFormatting: true,
    timeout: 60000, // 1 minuto
  };

  static async processImage(
    fileInfo: FileInfo, 
    options: OCROptions = {}
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    try {
      // Otimizar imagem antes do OCR
      const optimizedBuffer = await this.optimizeImage(fileInfo.buffer);
      
      // Configurar worker do Tesseract
      const worker = await Tesseract.createWorker(opts.language || 'por', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      // Configurar parâmetros do OCR
      if (opts.psm) {
        await worker.setParameters({
          tessedit_pageseg_mode: opts.psm.toString(),
        });
      }

      // Processar imagem
      const { data } = await worker.recognize(optimizedBuffer);
      await worker.terminate();

      // Pós-processar texto
      let processedText = data.text;
      if (!opts.preserveFormatting) {
        processedText = this.cleanText(processedText);
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        text: processedText,
        metadata: {
          fileType: fileInfo.mimeType,
          fileName: fileInfo.originalName,
          fileSize: fileInfo.size,
          processingTime,
          confidence: data.confidence,
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
        error: error instanceof Error ? error.message : 'Erro desconhecido no OCR'
      };
    }
  }

  private static async optimizeImage(buffer: Buffer): Promise<Buffer> {
    try {
      // Otimizar imagem para melhor OCR
      return await sharp(buffer)
        .resize(null, 2000, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .normalize()
        .sharpen()
        .greyscale()
        .png({ quality: 90 })
        .toBuffer();
    } catch (error) {
      console.warn('Falha na otimização da imagem, usando original:', error);
      return buffer;
    }
  }

  private static cleanText(text: string): string {
    return text
      // Remover múltiplas quebras de linha
      .replace(/\n{3,}/g, '\n\n')
      // Remover espaços extras
      .replace(/[ \t]{2,}/g, ' ')
      // Remover espaços no início e fim das linhas
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      // Remover linhas vazias extras
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  static getSupportedLanguages(): string[] {
    return [
      'por', // Português
      'eng', // Inglês
      'spa', // Espanhol
      'fra', // Francês
      'deu', // Alemão
      'ita', // Italiano
    ];
  }

  static async isLanguageAvailable(language: string): Promise<boolean> {
    try {
      const worker = await Tesseract.createWorker(language);
      await worker.terminate();
      return true;
    } catch {
      return false;
    }
  }
}