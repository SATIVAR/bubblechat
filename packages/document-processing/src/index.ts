// Exportar tipos
export * from './types';

// Exportar processadores
export { OCRProcessor } from './processors/ocrProcessor';
export { PDFProcessor } from './processors/pdfProcessor';
export { SpreadsheetProcessor } from './processors/spreadsheetProcessor';
export { TextPreprocessor } from './processors/textPreprocessor';

// Exportar utilitários
export { FileTypeDetector } from './utils/fileTypeDetector';

// Exportar classe principal
export { DocumentProcessor } from './documentProcessor';