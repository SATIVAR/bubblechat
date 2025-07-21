# Project Structure & Organization

## Directory Overview

```
bubblechat/
├── apps/                  # Individual applications
│   ├── admin-dashboard/   # Next.js - CRM Super Admin
│   ├── widget-fab/        # Next.js - Chat Widget
│   └── api/               # Node.js - Backend API
├── packages/              # Shared libraries
│   ├── ui/                # React components
│   ├── database/          # Prisma schema & migrations
│   └── llm-integrations/  # LLM provider abstractions
├── .kiro/                 # Kiro AI assistant configuration
├── uploads/               # User uploaded files
├── docker-compose.yml     # Docker configuration
└── turbo.json             # Turborepo configuration
```

## Key Directories Explained

### Apps

- **admin-dashboard**: Next.js application for the admin CRM interface
  - Manages clients, agents, and system configuration
  - Contains dashboard views, analytics, and admin tools

- **widget-fab**: Next.js application for the embeddable chat widget
  - Provides the chat interface for end users
  - Handles file uploads and message rendering

- **api**: Express backend API
  - Provides REST endpoints for frontend applications
  - Handles authentication, database operations, and LLM interactions

### Packages

- **ui**: Shared React components
  - Contains reusable UI elements used across applications
  - Implements design system and component library

- **database**: Prisma schema and database utilities
  - Defines data models and relationships
  - Contains migrations and database access utilities

- **llm-integrations**: Abstraction layer for LLM providers
  - Provides unified interface for different LLM services
  - Handles context management and prompt engineering
  
- **document-processing**: Processamento de documentos
  - Extração de texto de imagens (OCR)
  - Análise de PDFs
  - Processamento de planilhas Excel/CSV
  - Pré-processamento de texto para LLMs

## File Naming Conventions

- React components: PascalCase (e.g., `Button.tsx`, `UserCard.tsx`)
- Utility functions: camelCase (e.g., `formatDate.ts`, `validateInput.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`, `ERROR_CODES.ts`)
- Database models: PascalCase singular (e.g., `User.ts`, `Agent.ts`)
- API routes: kebab-case (e.g., `/api/user-settings`, `/api/chat-history`)

## Import Organization

Organize imports in the following order:
1. React and framework imports
2. Third-party libraries
3. Internal shared packages
4. Local components and utilities
5. Types and interfaces
6. Assets and styles

## Component Structure

React components should follow this organization:
1. Imports
2. Type definitions and interfaces
3. Constants
4. Component function
5. Helper functions
6. Exports

## API Structure

API endpoints should be organized by resource and follow RESTful conventions:
- `/api/v1/clients` - Client management
- `/api/v1/agents` - Agent management
- `/api/v1/conversations` - Chat conversations
- `/api/v1/uploads` - File uploads and processing

## Environment Configuration

Environment variables should be:
- Defined in `.env.example`
- Documented with comments
- Loaded via Next.js or dotenv
- Validated at application startup## Estrutur
a do Módulo de Processamento de Documentos

```
packages/document-processing/
├── src/
│   ├── ocr/                  # Processamento de imagens com OCR
│   │   ├── index.ts          # Exportações principais
│   │   ├── imageProcessor.ts # Processador de imagens
│   │   └── languages/        # Dados de idiomas para OCR
│   │
│   ├── pdf/                  # Processamento de PDFs
│   │   ├── index.ts
│   │   └── pdfProcessor.ts   # Extração de texto de PDFs
│   │
│   ├── spreadsheet/          # Processamento de planilhas
│   │   ├── index.ts
│   │   ├── excelProcessor.ts # Processador de Excel
│   │   └── csvProcessor.ts   # Processador de CSV
│   │
│   ├── preprocessing/        # Pré-processamento de texto
│   │   ├── index.ts
│   │   ├── cleaner.ts        # Limpeza de texto
│   │   ├── tokenizer.ts      # Tokenização
│   │   └── formatter.ts      # Formatação de saída
│   │
│   ├── utils/                # Utilitários compartilhados
│   │   ├── fileType.ts       # Detecção de tipo de arquivo
│   │   ├── errorHandling.ts  # Tratamento de erros
│   │   └── logger.ts         # Sistema de logging
│   │
│   └── index.ts              # Exportações principais do pacote
│
├── tests/                    # Testes unitários e de integração
├── package.json
└── tsconfig.json
```

## Estrutura do Módulo de Orçamentação

```
apps/api/src/modules/budget/
├── controllers/
│   └── budgetController.ts   # Controlador de orçamentos
│
├── services/
│   ├── budgetService.ts      # Serviço de orçamentos
│   └── templateService.ts    # Serviço de templates
│
├── models/
│   ├── Budget.ts             # Modelo de orçamento
│   └── BudgetItem.ts         # Modelo de item de orçamento
│
├── templates/
│   ├── default.ts            # Template padrão
│   └── premium.ts            # Template premium
│
├── utils/
│   ├── pricingCalculator.ts  # Calculadora de preços
│   └── budgetFormatter.ts    # Formatador de orçamentos
│
└── routes.ts                 # Rotas de API para orçamentos
```

## Fluxo de Dados para Orçamentação

1. Upload de arquivo pelo cliente através do widget ou dashboard
2. Armazenamento temporário do arquivo no servidor
3. Detecção do tipo de arquivo e roteamento para o processador apropriado
4. Extração de texto/dados do documento
5. Pré-processamento do texto extraído
6. Envio do texto processado para o LLM
7. Geração do orçamento pelo LLM
8. Formatação do orçamento de acordo com o template selecionado
9. Armazenamento do orçamento no banco de dados
10. Entrega do orçamento ao cliente