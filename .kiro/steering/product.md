# Bubblle Agent CRM Platform

Bubblle Agent CRM is a multi-tenant platform that enables businesses to manage multiple clients and AI agents. The platform provides a comprehensive solution for customer relationship management powered by large language models (LLMs).

## Core Features

- **Multi-tenant Architecture**: Support for multiple clients with isolated data and configurations
- **AI Agent Management**: Create, configure, and deploy AI agents for different use cases
- **Document Processing**: OCR para imagens, análise de PDF, leitura de Excel/CSV com extração automática de texto
- **Orçamentação Automatizada**: Geração de orçamentos baseados em documentos processados e requisitos do cliente
- **Embeddable Chat Widget**: Customizable chat bubble that can be embedded in any website
- **LLM Integration**: Support for multiple LLM providers (OpenAI, Gemini, Agno)
- **Analytics & Monitoring**: Conversation history, performance metrics, and usage statistics

## Target Users

- **Businesses**: Companies looking to deploy AI assistants for customer support
- **Equipe Comercial**: Profissionais que precisam gerar orçamentos baseados em documentos e requisitos de clientes
- **Developers**: Technical users integrating the chat widget into their applications
- **Administrators**: Users managing multiple clients and their configurations

## Product Roadmap

The product is being developed in phases:
1. Foundation (Core infrastructure and authentication)
2. LLM Integrations (Connecting to various AI providers)
3. Document Processing (Handling various file formats)
   - Extração de texto de imagens via OCR
   - Processamento de PDFs para extração de conteúdo textual
   - Leitura e análise de planilhas Excel/CSV
   - Pré-processamento de texto antes de enviar para LLMs
4. Widget Development (Embeddable chat interface)
5. Budgeting & Pricing (Product management and quotation)
   - Sistema de geração automática de orçamentos
   - Análise de requisitos do cliente via processamento de documentos
   - Formatação padronizada de propostas comerciais
   - Cálculo automático de preços baseado em regras de negócio
6. Analytics & Monitoring (Usage tracking and insights)

When developing new features, ensure they align with the current development phase and roadmap priorities.## Flu
xo de Orçamentação

O sistema de orçamentação segue o seguinte fluxo:

1. **Upload de Documentos**: O usuário faz upload de documentos (imagens, PDFs, planilhas) contendo requisitos ou especificações.

2. **Pré-processamento**: 
   - Imagens são processadas com OCR para extrair texto
   - PDFs são analisados para extrair conteúdo textual
   - Planilhas são convertidas em dados estruturados

3. **Análise de Requisitos**: O texto extraído é processado para identificar requisitos, especificações e parâmetros relevantes para o orçamento.

4. **Geração de Orçamento**: O agente LLM recebe apenas o texto processado (não os arquivos brutos) e gera um orçamento baseado nas informações extraídas.

5. **Formatação e Entrega**: O orçamento é formatado de acordo com templates pré-definidos e disponibilizado para o usuário.

Este fluxo garante que o processamento de documentos seja feito localmente antes de enviar apenas o texto relevante para os modelos LLM, otimizando o uso de tokens e melhorando a precisão das respostas.