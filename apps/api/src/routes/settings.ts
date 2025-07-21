import express from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/settings - Buscar configurações do sistema
router.get('/', async (req, res) => {
  try {
    // Buscar configurações do sistema
    let systemSettings = await prisma.systemSettings.findFirst();
    
    // Se não existir, criar configurações padrão
    if (!systemSettings) {
      systemSettings = await prisma.systemSettings.create({
        data: {
          platformName: 'Bubblechat Platform',
          supportEmail: 'suporte@bubblechat.com',
          maxFileSize: 50,
          defaultOcrLanguage: 'por',
          autoCleanup: true,
          auditLogs: true,
        },
      });
    }

    // Buscar provedores LLM
    const llmProviders = await prisma.lLMProvider.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: {
        ...systemSettings,
        llmProviders,
      },
    });
  } catch (error) {
    logger.error('Erro ao buscar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// PUT /api/settings - Atualizar configurações do sistema
router.put('/', async (req, res) => {
  try {
    const {
      platformName,
      supportEmail,
      maxFileSize,
      defaultOcrLanguage,
      autoCleanup,
      auditLogs,
      llmProviders,
    } = req.body;

    // Atualizar configurações do sistema
    let systemSettings = await prisma.systemSettings.findFirst();
    
    if (systemSettings) {
      systemSettings = await prisma.systemSettings.update({
        where: { id: systemSettings.id },
        data: {
          platformName,
          supportEmail,
          maxFileSize: parseInt(maxFileSize),
          defaultOcrLanguage,
          autoCleanup,
          auditLogs,
        },
      });
    } else {
      systemSettings = await prisma.systemSettings.create({
        data: {
          platformName,
          supportEmail,
          maxFileSize: parseInt(maxFileSize),
          defaultOcrLanguage,
          autoCleanup,
          auditLogs,
        },
      });
    }

    // Atualizar provedores LLM
    if (llmProviders && Array.isArray(llmProviders)) {
      // Remover provedores existentes
      await prisma.lLMProvider.deleteMany();
      
      // Criar novos provedores
      for (const provider of llmProviders) {
        if (provider.name && provider.apiKey) {
          await prisma.lLMProvider.create({
            data: {
              name: provider.name,
              apiKey: provider.apiKey,
              baseUrl: provider.baseUrl || null,
              models: provider.models || null,
              isActive: provider.isActive !== false,
            },
          });
        }
      }
    }

    // Buscar dados atualizados
    const updatedProviders = await prisma.lLMProvider.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      data: {
        ...systemSettings,
        llmProviders: updatedProviders,
      },
    });
  } catch (error) {
    logger.error('Erro ao atualizar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// POST /api/settings/llm-providers - Adicionar provedor LLM
router.post('/llm-providers', async (req, res) => {
  try {
    const { name, apiKey, baseUrl, models, isActive } = req.body;

    if (!name || !apiKey) {
      return res.status(400).json({
        success: false,
        message: 'Nome e API Key são obrigatórios',
      });
    }

    const provider = await prisma.lLMProvider.create({
      data: {
        name,
        apiKey,
        baseUrl: baseUrl || null,
        models: models || null,
        isActive: isActive !== false,
      },
    });

    res.json({
      success: true,
      message: 'Provedor LLM adicionado com sucesso',
      data: provider,
    });
  } catch (error) {
    logger.error('Erro ao adicionar provedor LLM:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// DELETE /api/settings/llm-providers/:id - Remover provedor LLM
router.delete('/llm-providers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lLMProvider.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Provedor LLM removido com sucesso',
    });
  } catch (error) {
    logger.error('Erro ao remover provedor LLM:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// PUT /api/settings/llm-providers/:id - Atualizar provedor LLM
router.put('/llm-providers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, apiKey, baseUrl, models, isActive } = req.body;

    const provider = await prisma.lLMProvider.update({
      where: { id },
      data: {
        name,
        apiKey,
        baseUrl: baseUrl || null,
        models: models || null,
        isActive,
      },
    });

    res.json({
      success: true,
      message: 'Provedor LLM atualizado com sucesso',
      data: provider,
    });
  } catch (error) {
    logger.error('Erro ao atualizar provedor LLM:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

export default router;