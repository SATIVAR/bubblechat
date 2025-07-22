# Bubblechat Platform 🚀

Plataforma multi-tenant para gerenciamento de clientes e agentes de IA, com processamento automático de documentos e geração de orçamentos, construída sobre uma arquitetura moderna com Firebase e Next.js.

## ✨ Funcionalidades Principais

- 🏢 **Arquitetura Multi-Tenant**: Suporte robusto para múltiplos clientes com dados isolados e seguros no Firebase Firestore.
- 🤖 **Agentes de IA Integrados**: Conexão nativa com múltiplos provedores de LLM, incluindo **OpenAI**, **Gemini**, e **Agno**.
- 📄 **Processamento Inteligente de Documentos**: Extração de dados de arquivos PDF, imagens (OCR) e planilhas para análise e uso pelo sistema.
- 💰 **Geração Automatizada de Orçamentos**: Criação de orçamentos dinâmicos com base nos dados extraídos dos documentos processados.
- 🎛️ **Dashboard Administrativo**: Uma interface de gerenciamento completa, construída com Next.js e Tailwind CSS, para total controle sobre clientes, agentes, documentos e configurações.
- 💬 **Widget de Chat Embarcável (FAB)**: Um widget flutuante e customizável que pode ser facilmente integrado a qualquer site para interação direta com os agentes de IA.
- ⚙️ **API Centralizada**: Um backend robusto em Node.js (Express) que gerencia toda a lógica de negócios, autenticação e comunicação com os serviços.

## 🏗️ Arquitetura do Monorepo (Turborepo)

O projeto utiliza um monorepo gerenciado com Turborepo para otimizar o desenvolvimento e o compartilhamento de código entre as aplicações.

```
bubblechat/
├── apps/
│   ├── admin-dashboard/  # Dashboard (Next.js, Tailwind CSS, ShadCN/UI)
│   ├── api/              # API Central (Node.js, Express, Prisma)
│   └── widget-fab/       # Widget de Chat (Next.js, Tailwind CSS)
│
├── packages/
│   ├── database/           # Configurações do Prisma e schema do banco
│   ├── document-processing/ # Lógica de processamento de documentos (OCR, PDF)
│   ├── llm-integrations/   # Módulo para integração com LLMs (OpenAI, Gemini)
│   └── ui/                 # Componentes React compartilhados
│
└── firebase.json         # Configuração dos serviços Firebase (Firestore, Functions)
```

## 🛠️ Tecnologias Utilizadas

- **Monorepo:** Turborepo
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Banco de Dados:** Firebase Firestore (NoSQL)
- **Comunicação em Tempo Real:** Socket.IO
- **ORM:** Prisma (para uma camada de acesso a dados estruturada)
- **Autenticação:** Firebase Authentication
- **Hospedagem:** Vercel (ideal para Next.js) e Firebase Hosting

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- `npm` ou `pnpm` como gerenciador de pacotes
- Uma conta no Firebase com um projeto configurado

### 1. Configuração do Ambiente

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd bubblechat
    ```

2.  **Instale as dependências:**
    A partir da raiz do projeto, execute:
    ```bash
    npm install
    ```
    *(ou `pnpm install` se preferir)*

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do diretório `apps/api` e adicione as credenciais do seu projeto Firebase e outras chaves de API:
    ```env
    # Firebase Admin SDK - Crie uma chave de serviço no console do Firebase
    FIREBASE_PROJECT_ID="seu-project-id"
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
"
    FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@seu-project-id.iam.gserviceaccount.com"

    # Chaves de API para os LLMs
    OPENAI_API_KEY="sk-..."
    GEMINI_API_KEY="..."

    # Outras configurações
    API_PORT=3001
    ```

### 2. Executando a Aplicação

Com as dependências instaladas e o ambiente configurado, inicie todos os serviços simultaneamente a partir da raiz do projeto:

```bash
npm run dev
```
*(ou `turbo dev`)*

Isso irá iniciar o `admin-dashboard`, a `api` e o `widget-fab` em modo de desenvolvimento.

## ✅ Próximos Passos

1.  **Finalizar a Migração para Firebase Auth**: Implementar o fluxo completo de login, registro e proteção de rotas no Dashboard usando Firebase Authentication.
2.  **Testes Unitários e de Integração**: Adicionar uma suíte de testes com Jest/Vitest e React Testing Library para garantir a qualidade e estabilidade dos componentes e da API.
3.  **CI/CD com GitHub Actions**: Criar um workflow para automatizar a execução de testes, linting e o deploy das aplicações para a Vercel e Firebase.
4.  **Otimização de Consultas Firestore**: Refinar as regras de segurança do Firestore e otimizar as consultas para garantir performance e escalabilidade.
5.  **Documentação da API**: Gerar documentação automática para os endpoints da API utilizando ferramentas como Swagger ou OpenAPI.
