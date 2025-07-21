# Technology Stack & Build System

## Core Technologies

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Styling**: Tailwind CSS
- **Build System**: Turborepo (monorepo)
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT with refresh tokens
- **LLM Providers**: OpenAI GPT-4, Google Gemini, Agno
- **Document Processing**:
  - OCR: Tesseract.js para extração de texto de imagens
  - PDF: pdf-parse para extração de texto de documentos PDF
  - Excel/CSV: xlsx para processamento de planilhas
  - Preprocessamento: bibliotecas de NLP para limpeza e estruturação de texto

## Monorepo Structure

This project uses Turborepo to manage a monorepo with multiple applications and shared packages:

- **Apps**: Individual applications (admin-dashboard, widget-fab, api)
- **Packages**: Shared libraries (ui, database, llm-integrations)

## Common Commands

### Development

```bash
# Start all applications in development mode
npm run dev

# Type checking across all packages
npm run type-check

# Linting across all packages
npm run lint
```

### Database

```bash
# Run database migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Docker

```bash
# Start all services with Docker
npm run docker:up

# Stop all Docker services
npm run docker:down

# Rebuild Docker containers
npm run docker:build
```

### Production

```bash
# Build all applications for production
npm run build

# Start all applications in production mode
npm run start
```

## Code Style & Conventions

- Use TypeScript for all new code
- Follow React functional component patterns with hooks
- Use Tailwind CSS for styling
- Implement responsive design for all UI components
- Follow the Prisma schema for database models
- Use environment variables for configuration
- Implement proper error handling and logging

## Testing

- Unit tests should be placed alongside the code they test
- Integration tests should be in a separate `__tests__` directory
- Use Jest for testing framework
- Use React Testing Library for component tests

## Security Practices

- Validate all user inputs
- Implement rate limiting for API endpoints
- Use parameterized queries for database operations
- Sanitize data before storing in the database
- Set proper CORS headers
- Use environment variables for sensitive information## Proce
ssamento de Documentos

### Bibliotecas de Processamento

```bash
# Instalação das bibliotecas de processamento de documentos
npm install tesseract.js pdf-parse xlsx natural string-similarity
```

### Fluxo de Processamento

1. **Detecção de Tipo de Arquivo**:
   - Verificação de MIME type e extensão
   - Roteamento para o processador apropriado

2. **Processamento de Imagens**:
   ```javascript
   // Exemplo de uso do Tesseract.js
   import Tesseract from 'tesseract.js';
   
   const processImage = async (imagePath) => {
     try {
       const result = await Tesseract.recognize(
         imagePath,
         'por', // Idioma português
         { logger: m => console.log(m) }
       );
       return result.data.text;
     } catch (error) {
       console.error('Erro no OCR:', error);
       throw new Error('Falha ao processar imagem');
     }
   };
   ```

3. **Processamento de PDFs**:
   ```javascript
   // Exemplo de uso do pdf-parse
   import fs from 'fs';
   import pdf from 'pdf-parse';
   
   const processPdf = async (pdfPath) => {
     try {
       const dataBuffer = fs.readFileSync(pdfPath);
       const data = await pdf(dataBuffer);
       return data.text;
     } catch (error) {
       console.error('Erro ao processar PDF:', error);
       throw new Error('Falha ao extrair texto do PDF');
     }
   };
   ```

4. **Processamento de Planilhas**:
   ```javascript
   // Exemplo de uso do xlsx
   import xlsx from 'xlsx';
   
   const processSpreadsheet = (filePath) => {
     try {
       const workbook = xlsx.readFile(filePath);
       const sheetNames = workbook.SheetNames;
       let result = '';
       
       sheetNames.forEach(sheetName => {
         const worksheet = workbook.Sheets[sheetName];
         const json = xlsx.utils.sheet_to_json(worksheet);
         result += `Planilha: ${sheetName}\n`;
         result += JSON.stringify(json, null, 2);
         result += '\n\n';
       });
       
       return result;
     } catch (error) {
       console.error('Erro ao processar planilha:', error);
       throw new Error('Falha ao extrair dados da planilha');
     }
   };
   ```

5. **Pré-processamento de Texto**:
   ```javascript
   // Exemplo de limpeza e estruturação de texto
   import natural from 'natural';
   
   const preprocessText = (text) => {
     // Remover caracteres especiais e normalizar espaços
     let processed = text.replace(/[^\w\s.,;:!?()]/g, ' ').replace(/\s+/g, ' ');
     
     // Tokenização
     const tokenizer = new natural.WordTokenizer();
     const tokens = tokenizer.tokenize(processed);
     
     // Remover stopwords (opcional)
     const stopwords = ['a', 'o', 'e', 'de', 'para', 'com', 'em', 'um', 'uma'];
     const filteredTokens = tokens.filter(token => !stopwords.includes(token.toLowerCase()));
     
     // Reconstruir texto
     return filteredTokens.join(' ');
   };
   ```

### Integração com LLMs

```javascript
// Exemplo de integração com OpenAI após processamento
import { OpenAI } from 'openai';

const generateBudget = async (processedText) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em gerar orçamentos baseados em requisitos de clientes. Analise o texto fornecido e crie um orçamento detalhado."
        },
        {
          role: "user",
          content: processedText
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao gerar orçamento:', error);
    throw new Error('Falha ao gerar orçamento');
  }
};
```