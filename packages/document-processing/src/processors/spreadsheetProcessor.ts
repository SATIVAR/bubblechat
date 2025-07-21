import * as XLSX from 'xlsx';
import { ProcessingResult, SpreadsheetOptions, FileInfo, SupportedFileTypes } from '../types';

export class SpreadsheetProcessor {
  private static readonly DEFAULT_OPTIONS: SpreadsheetOptions = {
    language: 'por',
    preserveFormatting: true,
    includeHeaders: true,
    maxRows: 10000,
    timeout: 60000, // 1 minuto
  };

  static async processSpreadsheet(
    fileInfo: FileInfo,
    options: SpreadsheetOptions = {}
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    try {
      let workbook: XLSX.WorkBook;

      // Processar baseado no tipo de arquivo
      if (fileInfo.mimeType === SupportedFileTypes.CSV) {
        workbook = this.processCSV(fileInfo.buffer);
      } else {
        workbook = XLSX.read(fileInfo.buffer, { type: 'buffer' });
      }

      // Extrair dados de todas as planilhas ou planilhas específicas
      const sheetsToProcess = opts.sheetNames || workbook.SheetNames;
      let extractedText = '';

      for (const sheetName of sheetsToProcess) {
        if (!workbook.Sheets[sheetName]) {
          console.warn(`Planilha '${sheetName}' não encontrada`);
          continue;
        }

        const sheetData = this.extractSheetData(
          workbook.Sheets[sheetName], 
          sheetName, 
          opts
        );
        
        extractedText += sheetData + '\n\n';
      }

      // Limpar texto se necessário
      if (!opts.preserveFormatting) {
        extractedText = this.cleanText(extractedText);
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        text: extractedText.trim(),
        metadata: {
          fileType: fileInfo.mimeType,
          fileName: fileInfo.originalName,
          fileSize: fileInfo.size,
          processingTime,
          confidence: 100, // Planilhas têm alta confiança
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
        error: error instanceof Error ? error.message : 'Erro desconhecido no processamento da planilha'
      };
    }
  }

  private static processCSV(buffer: Buffer): XLSX.WorkBook {
    const csvText = buffer.toString('utf-8');
    return XLSX.read(csvText, { type: 'string' });
  }

  private static extractSheetData(
    worksheet: XLSX.WorkSheet, 
    sheetName: string, 
    options: SpreadsheetOptions
  ): string {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    let result = `=== PLANILHA: ${sheetName} ===\n`;

    // Limitar número de linhas se especificado
    if (options.maxRows && range.e.r > options.maxRows) {
      range.e.r = options.maxRows - 1;
    }

    // Converter para JSON para facilitar o processamento
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      range: range,
      header: 1, // Usar índices numéricos como headers
      defval: '', // Valor padrão para células vazias
    }) as any[][];

    if (jsonData.length === 0) {
      return result + 'Planilha vazia\n';
    }

    // Processar cabeçalhos se incluídos
    if (options.includeHeaders && jsonData.length > 0) {
      const headers = jsonData[0];
      result += 'COLUNAS: ' + headers.join(' | ') + '\n\n';
      
      // Processar dados (pular primeira linha se são cabeçalhos)
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const rowData = headers.map((header, index) => {
          const value = row[index] || '';
          return `${header}: ${value}`;
        }).join(' | ');
        
        result += `LINHA ${i}: ${rowData}\n`;
      }
    } else {
      // Processar todas as linhas sem assumir cabeçalhos
      jsonData.forEach((row, index) => {
        const rowData = row.join(' | ');
        result += `LINHA ${index + 1}: ${rowData}\n`;
      });
    }

    return result;
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

  static getSheetNames(buffer: Buffer, mimeType: string): string[] {
    try {
      let workbook: XLSX.WorkBook;
      
      if (mimeType === SupportedFileTypes.CSV) {
        return ['Sheet1']; // CSV tem apenas uma "planilha"
      } else {
        workbook = XLSX.read(buffer, { type: 'buffer' });
        return workbook.SheetNames;
      }
    } catch (error) {
      console.warn('Erro ao obter nomes das planilhas:', error);
      return [];
    }
  }

  static async getSpreadsheetInfo(buffer: Buffer, mimeType: string): Promise<any> {
    try {
      let workbook: XLSX.WorkBook;
      
      if (mimeType === SupportedFileTypes.CSV) {
        workbook = this.processCSV(buffer);
      } else {
        workbook = XLSX.read(buffer, { type: 'buffer' });
      }

      const info = {
        sheetCount: workbook.SheetNames.length,
        sheetNames: workbook.SheetNames,
        sheets: {} as any
      };

      // Obter informações de cada planilha
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
        
        info.sheets[sheetName] = {
          rowCount: range.e.r + 1,
          columnCount: range.e.c + 1,
          range: worksheet['!ref']
        };
      });

      return info;
    } catch (error) {
      console.warn('Erro ao obter informações da planilha:', error);
      return null;
    }
  }
}