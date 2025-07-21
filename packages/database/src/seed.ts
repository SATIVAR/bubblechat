import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes (opcional - remova se não quiser limpar)
  await prisma.budgetItem.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.document.deleteMany()
  await prisma.agent.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()
  await prisma.processingLog.deleteMany()

  // Criar usuários
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@bubblechat.com',
      name: 'Administrador',
      role: 'ADMIN'
    }
  })

  const clientUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Usuário Cliente',
      role: 'CLIENT'
    }
  })

  console.log('✅ Usuários criados')

  // Criar clientes
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'João Silva',
        email: 'joao@empresa.com',
        company: 'Empresa ABC Ltda',
        phone: '(11) 99999-9999',
        whatsapp: '(11) 99999-9999',
        website: 'https://empresaabc.com.br',
        userId: adminUser.id
      }
    }),
    prisma.client.create({
      data: {
        name: 'Maria Santos',
        email: 'maria@startup.com',
        company: 'Startup Inovadora',
        phone: '(11) 88888-8888',
        whatsapp: '(11) 88888-8888',
        website: 'https://startupinovadora.com',
        userId: adminUser.id
      }
    }),
    prisma.client.create({
      data: {
        name: 'Pedro Costa',
        email: 'pedro@consultoria.com',
        company: 'Consultoria Premium',
        phone: '(11) 77777-7777',
        whatsapp: '(11) 77777-7777',
        website: 'https://consultoriapremium.com.br',
        userId: adminUser.id
      }
    }),
    prisma.client.create({
      data: {
        name: 'Ana Oliveira',
        email: 'ana@tech.com',
        company: 'Tech Solutions',
        phone: '(11) 66666-6666',
        whatsapp: '(11) 66666-6666',
        website: 'https://techsolutions.com',
        userId: clientUser.id
      }
    }),
    prisma.client.create({
      data: {
        name: 'Carlos Ferreira',
        email: 'carlos@digital.com',
        company: 'Digital Agency',
        phone: '(11) 55555-5555',
        whatsapp: '(11) 55555-5555',
        website: 'https://digitalagency.com.br',
        userId: clientUser.id
      }
    })
  ])

  console.log('✅ Clientes criados')

  // Criar agentes
  const agents = await Promise.all([
    prisma.agent.create({
      data: {
        name: 'Assistente Comercial',
        description: 'Especializado em vendas e atendimento ao cliente',
        model: 'gpt-4',
        isActive: true,
        clientId: clients[0].id,
        userId: adminUser.id,
        config: {
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: 'Você é um assistente comercial especializado em vendas.'
        }
      }
    }),
    prisma.agent.create({
      data: {
        name: 'Suporte Técnico',
        description: 'Especializado em suporte técnico e resolução de problemas',
        model: 'gpt-4',
        isActive: true,
        clientId: clients[1].id,
        userId: adminUser.id,
        config: {
          temperature: 0.3,
          maxTokens: 1500,
          systemPrompt: 'Você é um especialista em suporte técnico.'
        }
      }
    }),
    prisma.agent.create({
      data: {
        name: 'Consultor Financeiro',
        description: 'Especializado em consultoria financeira e orçamentos',
        model: 'gpt-4',
        isActive: true,
        clientId: clients[2].id,
        userId: clientUser.id,
        config: {
          temperature: 0.5,
          maxTokens: 2000,
          systemPrompt: 'Você é um consultor financeiro experiente.'
        }
      }
    }),
    prisma.agent.create({
      data: {
        name: 'Assistente de Marketing',
        description: 'Especializado em marketing digital e campanhas',
        model: 'gpt-3.5-turbo',
        isActive: false,
        clientId: clients[3].id,
        userId: clientUser.id,
        config: {
          temperature: 0.8,
          maxTokens: 1200,
          systemPrompt: 'Você é um especialista em marketing digital.'
        }
      }
    })
  ])

  console.log('✅ Agentes criados')

  // Criar documentos
  const documents = await Promise.all([
    prisma.document.create({
      data: {
        fileName: '1704067200000-proposta-comercial.pdf',
        originalName: 'proposta-comercial.pdf',
        mimeType: 'application/pdf',
        size: 2048576,
        status: 'COMPLETED',
        extractedText: 'Proposta comercial para desenvolvimento de sistema de gestão empresarial. Inclui módulos de vendas, estoque, financeiro e relatórios. Prazo de entrega: 6 meses. Valor total: R$ 85.000,00.',
        confidence: 0.95,
        processingTime: 3200,
        clientId: clients[0].id,
        metadata: {
          pages: 5,
          language: 'pt-BR',
          keywords: ['sistema', 'gestão', 'vendas', 'estoque']
        }
      }
    }),
    prisma.document.create({
      data: {
        fileName: '1704153600000-especificacoes-tecnicas.docx',
        originalName: 'especificacoes-tecnicas.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 1024000,
        status: 'COMPLETED',
        extractedText: 'Especificações técnicas para desenvolvimento de aplicativo mobile. Plataformas: iOS e Android. Funcionalidades: login, dashboard, relatórios, notificações push. Integração com APIs externas.',
        confidence: 0.92,
        processingTime: 2800,
        clientId: clients[1].id,
        metadata: {
          wordCount: 1250,
          language: 'pt-BR',
          keywords: ['mobile', 'iOS', 'Android', 'API']
        }
      }
    }),
    prisma.document.create({
      data: {
        fileName: '1704240000000-planilha-custos.xlsx',
        originalName: 'planilha-custos.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 512000,
        status: 'COMPLETED',
        extractedText: 'Planilha de custos operacionais. Desenvolvimento: R$ 45.000. Design: R$ 15.000. Testes: R$ 8.000. Infraestrutura: R$ 12.000. Total: R$ 80.000.',
        confidence: 0.98,
        processingTime: 1500,
        clientId: clients[2].id,
        metadata: {
          sheets: 3,
          rows: 150,
          columns: 8
        }
      }
    }),
    prisma.document.create({
      data: {
        fileName: '1704326400000-imagem-requisitos.jpg',
        originalName: 'imagem-requisitos.jpg',
        mimeType: 'image/jpeg',
        size: 3072000,
        status: 'PROCESSING',
        extractedText: null,
        confidence: null,
        processingTime: null,
        clientId: clients[3].id,
        metadata: {
          width: 1920,
          height: 1080,
          format: 'JPEG'
        }
      }
    }),
    prisma.document.create({
      data: {
        fileName: '1704412800000-contrato-servicos.pdf',
        originalName: 'contrato-servicos.pdf',
        mimeType: 'application/pdf',
        size: 1536000,
        status: 'ERROR',
        extractedText: null,
        confidence: null,
        processingTime: null,
        clientId: clients[4].id,
        metadata: {
          error: 'Arquivo corrompido',
          attempts: 3
        }
      }
    })
  ])

  console.log('✅ Documentos criados')

  // Criar orçamentos
  const budgets = await Promise.all([
    prisma.budget.create({
      data: {
        title: 'Sistema de Gestão Empresarial',
        description: 'Desenvolvimento completo de sistema de gestão com módulos integrados',
        value: 85000.00,
        status: 'APPROVED',
        clientId: clients[0].id,
        documentId: documents[0].id,
        metadata: {
          approvedAt: new Date(),
          approvedBy: 'admin@bubblechat.com'
        }
      }
    }),
    prisma.budget.create({
      data: {
        title: 'Aplicativo Mobile Multiplataforma',
        description: 'Desenvolvimento de app para iOS e Android com funcionalidades avançadas',
        value: 65000.00,
        status: 'SENT',
        clientId: clients[1].id,
        documentId: documents[1].id,
        metadata: {
          sentAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.budget.create({
      data: {
        title: 'Consultoria em Infraestrutura',
        description: 'Análise e otimização da infraestrutura tecnológica',
        value: 25000.00,
        status: 'DRAFT',
        clientId: clients[2].id,
        documentId: documents[2].id,
        metadata: {
          createdBy: 'admin@bubblechat.com'
        }
      }
    }),
    prisma.budget.create({
      data: {
        title: 'Website Institucional',
        description: 'Desenvolvimento de website responsivo com CMS',
        value: 15000.00,
        status: 'REJECTED',
        clientId: clients[3].id,
        metadata: {
          rejectedAt: new Date(),
          rejectionReason: 'Orçamento acima do esperado'
        }
      }
    }),
    prisma.budget.create({
      data: {
        title: 'E-commerce Completo',
        description: 'Plataforma de e-commerce com integração de pagamentos',
        value: 120000.00,
        status: 'SENT',
        clientId: clients[4].id,
        metadata: {
          sentAt: new Date(),
          followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    })
  ])

  console.log('✅ Orçamentos criados')

  // Criar itens dos orçamentos
  await Promise.all([
    // Itens do Sistema de Gestão
    prisma.budgetItem.createMany({
      data: [
        {
          description: 'Desenvolvimento do módulo de vendas',
          quantity: 1,
          unitPrice: 25000.00,
          totalPrice: 25000.00,
          budgetId: budgets[0].id
        },
        {
          description: 'Desenvolvimento do módulo de estoque',
          quantity: 1,
          unitPrice: 20000.00,
          totalPrice: 20000.00,
          budgetId: budgets[0].id
        },
        {
          description: 'Desenvolvimento do módulo financeiro',
          quantity: 1,
          unitPrice: 30000.00,
          totalPrice: 30000.00,
          budgetId: budgets[0].id
        },
        {
          description: 'Sistema de relatórios',
          quantity: 1,
          unitPrice: 10000.00,
          totalPrice: 10000.00,
          budgetId: budgets[0].id
        }
      ]
    }),
    
    // Itens do App Mobile
    prisma.budgetItem.createMany({
      data: [
        {
          description: 'Desenvolvimento iOS',
          quantity: 1,
          unitPrice: 30000.00,
          totalPrice: 30000.00,
          budgetId: budgets[1].id
        },
        {
          description: 'Desenvolvimento Android',
          quantity: 1,
          unitPrice: 25000.00,
          totalPrice: 25000.00,
          budgetId: budgets[1].id
        },
        {
          description: 'Backend e APIs',
          quantity: 1,
          unitPrice: 10000.00,
          totalPrice: 10000.00,
          budgetId: budgets[1].id
        }
      ]
    }),

    // Itens da Consultoria
    prisma.budgetItem.createMany({
      data: [
        {
          description: 'Análise de infraestrutura atual',
          quantity: 40,
          unitPrice: 200.00,
          totalPrice: 8000.00,
          budgetId: budgets[2].id
        },
        {
          description: 'Plano de otimização',
          quantity: 1,
          unitPrice: 12000.00,
          totalPrice: 12000.00,
          budgetId: budgets[2].id
        },
        {
          description: 'Implementação das melhorias',
          quantity: 25,
          unitPrice: 200.00,
          totalPrice: 5000.00,
          budgetId: budgets[2].id
        }
      ]
    })
  ])

  console.log('✅ Itens dos orçamentos criados')

  // Criar logs de processamento
  await prisma.processingLog.createMany({
    data: [
      {
        fileName: 'proposta-comercial.pdf',
        fileType: 'PDF',
        status: 'COMPLETED',
        processingTime: 3200,
        confidence: 0.95
      },
      {
        fileName: 'especificacoes-tecnicas.docx',
        fileType: 'DOCX',
        status: 'COMPLETED',
        processingTime: 2800,
        confidence: 0.92
      },
      {
        fileName: 'planilha-custos.xlsx',
        fileType: 'XLSX',
        status: 'COMPLETED',
        processingTime: 1500,
        confidence: 0.98
      },
      {
        fileName: 'imagem-requisitos.jpg',
        fileType: 'IMAGE',
        status: 'PROCESSING',
        processingTime: null,
        confidence: null
      },
      {
        fileName: 'contrato-servicos.pdf',
        fileType: 'PDF',
        status: 'ERROR',
        processingTime: null,
        confidence: null,
        errorMessage: 'Arquivo corrompido - não foi possível extrair texto'
      }
    ]
  })

  console.log('✅ Logs de processamento criados')

  // Estatísticas finais
  const stats = {
    users: await prisma.user.count(),
    clients: await prisma.client.count(),
    agents: await prisma.agent.count(),
    documents: await prisma.document.count(),
    budgets: await prisma.budget.count(),
    budgetItems: await prisma.budgetItem.count(),
    processingLogs: await prisma.processingLog.count()
  }

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('📊 Estatísticas:')
  console.log(`   👥 Usuários: ${stats.users}`)
  console.log(`   🏢 Clientes: ${stats.clients}`)
  console.log(`   🤖 Agentes: ${stats.agents}`)
  console.log(`   📄 Documentos: ${stats.documents}`)
  console.log(`   💰 Orçamentos: ${stats.budgets}`)
  console.log(`   📋 Itens de orçamento: ${stats.budgetItems}`)
  console.log(`   📝 Logs de processamento: ${stats.processingLogs}`)
  console.log('\n✨ Banco de dados populado com dados realistas!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })