# Bubblechat Platform 🚀

Plataforma multi-tenant para gerenciamento de clientes e agentes IA com processamento automático de documentos e geração de orçamentos.

## ✨ Funcionalidades

- 🏢 **Multi-tenant**: Suporte a múltiplos clientes isolados
- 🤖 **Agentes IA**: Integração com OpenAI, Gemini e Agno
- 📄 **Processamento de Documentos**: OCR, PDF e planilhas
- 💰 **Orçamentação Automática**: Geração baseada em documentos
- 🎛️ **Admin Dashboard**: Interface completa de gerenciamento
- 🔧 **Widget Embarcável**: Chat customizável para sites

## 🏗️ Arquitetura

```
bubblechat/
├── apps/
│   ├── admin-dashboard/    # Dashboard administrativo (Next.js)
│   ├── widget-fab/         # Widget de chat (Next.js)
│   └── api/               # API backend (Node.js/Express)
├── packages/
│   ├── ui/                # Componentes compartilhados
│   ├── database/          # Prisma schema e cliente
│   ├── document-processing/ # Processamento de documentos
│   └── llm-integrations/  # Integrações com LLMs
```

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- npm 8+
- Docker (opcional, mas recomendado)

### Instalação Automática
```bash
# Clone o repositório
git clone <repository-url>
cd bubblechat

# Execute o setup automático
npm run setup
```

### Instalação Manual
```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 3. Iniciar banco de dados (Docker)
npm run docker:up

# 4. Executar migrações
npm run db:migrate

# 5. Iniciar desenvolvimento
npm run dev
```

## 🌐 Acessos

- **Admin Dashboard**: http://localhost:3001
- **Widget**: http://localhost:3000
- **API**: http://localhost:3002

## 📋 Comandos Disponíveis

### Desenvolvimento
```bash
npm run dev          # Iniciar todos os apps em desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar em produção
npm run lint         # Linting
npm run type-check   # Verificação de tipos
```

### Banco de Dados
```bash
npm run db:migrate   # Executar migrações
npm run db:generate  # Gerar cliente Prisma
npm run db:studio    # Abrir Prisma Studio
npm run db:reset     # Resetar banco (cuidado!)
```

### Docker
```bash
npm run docker:up    # Iniciar serviços
npm run docker:down  # Parar serviços
npm run docker:build # Rebuild containers
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/bubblechat"

# LLM APIs
OPENAI_API_KEY="sk-your-key"
GEMINI_API_KEY="your-key"
AGNO_API_KEY="your-key"

# Document Processing
MAX_FILE_SIZE="50MB"
OCR_LANGUAGE="por"
```

### Processamento de Documentos

O sistema suporta:
- **Imagens**: JPG, PNG, TIFF, BMP (OCR com Tesseract.js)
- **PDFs**: Extração de texto + OCR para escaneados
- **Planilhas**: Excel (.xlsx, .xls) e CSV

### Integrações LLM

Suporte nativo para:
- **OpenAI GPT-4**: Geração de orçamentos
- **Google Gemini**: Alternativa ao GPT
- **Agno**: Provider brasileiro

## 📊 Fluxo de Orçamentação

1. **Upload** → Documento enviado via interface
2. **Processamento** → OCR/PDF/Planilha extrai texto
3. **Pré-processamento** → Limpeza e formatação
4. **LLM** → Geração de orçamento baseado no texto
5. **Resultado** → Orçamento estruturado e formatado

## 🏢 Multi-tenancy

- Isolamento completo de dados por cliente
- Configurações independentes por tenant
- Agentes IA personalizados por cliente
- Templates de orçamento customizáveis

## 🔒 Segurança

- Autenticação JWT com refresh tokens
- Validação rigorosa de uploads
- Sanitização de dados
- Rate limiting
- CORS configurável

## 📈 Performance

- Processamento assíncrono de documentos
- Cache Redis para sessões
- Otimização de imagens para OCR
- Pool de workers para CPU intensivo

## 🐳 Docker

Ambiente completo com:
- PostgreSQL 15
- Redis 7
- Apps Next.js/Node.js
- Volumes persistentes

```bash
docker-compose up -d
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Coverage
npm run test:coverage
```

## 📚 Documentação

- [Implementação Completa](IMPLEMENTATION.md)
- [Especificações](/.kiro/specs/)
- [API Documentation](docs/api.md)
- [Widget Integration](docs/widget.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 Email: suporte@bubblechat.com
- 💬 Discord: [Link do servidor]
- 📖 Docs: [Link da documentação]
- 🐛 Issues: [GitHub Issues]

---

**Desenvolvido com ❤️ para automatizar orçamentação através de IA**