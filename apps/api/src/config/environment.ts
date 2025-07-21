import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bubblle_crm',
  },
  
  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3001', // Admin Dashboard
      'http://localhost:3002', // Widget FAB
      'http://localhost:3003', // Development
    ],
  },
  
  // File Upload
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760', 10), // 10MB
    allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ],
    path: process.env.UPLOAD_PATH || './uploads',
  },
  
  // LLM APIs
  llm: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
    agno: {
      apiKey: process.env.AGNO_API_KEY,
      baseURL: process.env.AGNO_BASE_URL,
    },
  },
  
  // Super Admin
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL || 'admin@bubblle.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'admin123',
    name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
  },
  
  // External URLs
  urls: {
    api: process.env.API_URL || 'http://localhost:3000',
    admin: process.env.ADMIN_URL || 'http://localhost:3001',
    widget: process.env.WIDGET_URL || 'http://localhost:3002',
  },
  
  // OCR Service
  ocr: {
    provider: process.env.OCR_PROVIDER || 'tesseract', // tesseract, google, aws
    googleVision: {
      keyFile: process.env.GOOGLE_VISION_KEY_FILE,
    },
    awsTextract: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
    },
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
  },
};