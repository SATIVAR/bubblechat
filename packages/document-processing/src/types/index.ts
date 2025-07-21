export interface ProcessingResult {
  success: boolean;
  text: string;
  metadata: {
    fileType: string;
    fileName: string;
    fileSize: number;
    processingTime: number;
    confidence?: number;
    pageCount?: number;
    language?: string;
  };
  error?: string;
}

export interface ProcessingOptions {
  language?: string;
  preserveFormatting?: boolean;
  removeStopwords?: boolean;
  maxFileSize?: number;
  timeout?: number;
}

export interface OCROptions extends ProcessingOptions {
  psm?: number; // Page segmentation mode
  oem?: number; // OCR Engine mode
}

export interface PDFOptions extends ProcessingOptions {
  maxPages?: number;
  includeMetadata?: boolean;
}

export interface SpreadsheetOptions extends ProcessingOptions {
  sheetNames?: string[];
  includeHeaders?: boolean;
  maxRows?: number;
}

export enum SupportedFileTypes {
  PDF = 'application/pdf',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  TIFF = 'image/tiff',
  BMP = 'image/bmp',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS = 'application/vnd.ms-excel',
  CSV = 'text/csv'
}

export interface FileInfo {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
  path?: string;
}