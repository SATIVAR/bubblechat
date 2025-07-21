const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSettingsData() {
  try {
    console.log('🔧 Criando dados de configurações...');

    // Verificar se já existem configurações
    const existingSettings = await prisma.systemSettings.findFirst();
    
    if (!existingSettings) {
      // Criar configurações padrão
      const settings = await prisma.systemSettings.create({
        data: {
          platformName: 'Bubblechat Platform',
          supportEmail: 'suporte@bubblechat.com',
          maxFileSize: 50,
          defaultOcrLanguage: 'por',
          autoCleanup: true,
          auditLogs: true,
        },
      });
      console.log('✅ Configurações do sistema criadas:', settings.id);
    } else {
      console.log('ℹ️ Configurações do sistema já existem');
    }

    // Verificar se já existem provedores LLM
    const existingProviders = await prisma.lLMProvider.findMany();
    
    if (existingProviders.length === 0) {
      // Criar provedores LLM de exemplo
      const providers = [
        {
          name: 'OpenAI',
          apiKey: 'sk-exemplo-openai-key-aqui',
          baseUrl: 'https://api.openai.com/v1',
          models: ['gpt-4', 'gpt-3.5-turbo'],
          isActive: true,
        },
        {
          name: 'Google Gemini',
          apiKey: 'exemplo-gemini-key-aqui',
          baseUrl: 'https://generativelanguage.googleapis.com/v1',
          models: ['gemini-pro', 'gemini-pro-vision'],
          isActive: false,
        },
        {
          name: 'Agno',
          apiKey: 'exemplo-agno-key-aqui',
          baseUrl: null,
          models: ['agno-1', 'agno-2'],
          isActive: false,
        },
      ];

      for (const provider of providers) {
        const created = await prisma.lLMProvider.create({
          data: provider,
        });
        console.log(`✅ Provedor LLM criado: ${created.name} (${created.id})`);
      }
    } else {
      console.log('ℹ️ Provedores LLM já existem');
    }

    console.log('🎉 Dados de configurações criados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar dados de configurações:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSettingsData();