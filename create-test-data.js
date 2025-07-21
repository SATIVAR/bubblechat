const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestData() {
  try {
    console.log('🔧 Criando dados de teste...')

    // Verificar se já existe um usuário admin
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          id: 'admin-user-id',
          email: 'admin@bubblechat.com',
          name: 'Admin Principal',
          role: 'ADMIN'
        }
      })
      console.log('✅ Usuário admin criado')
    } else {
      console.log('✅ Usuário admin já existe')
    }

    // Criar alguns clientes de teste
    const testClients = [
      {
        name: 'João Silva',
        email: 'joao@empresa.com',
        company: 'Empresa ABC',
        phone: '(11) 99999-1111',
        whatsapp: '(11) 99999-1111',
        website: 'https://empresa-abc.com'
      },
      {
        name: 'Maria Santos',
        email: 'maria@startup.com',
        company: 'Startup XYZ',
        phone: '(11) 99999-2222',
        whatsapp: '(11) 99999-2222',
        website: 'https://startup-xyz.com'
      },
      {
        name: 'Pedro Costa',
        email: 'pedro@freelancer.com',
        company: 'Freelancer',
        phone: '(11) 99999-3333',
        whatsapp: '(11) 99999-3333'
      }
    ]

    for (const clientData of testClients) {
      const existingClient = await prisma.client.findUnique({
        where: { email: clientData.email }
      })

      if (!existingClient) {
        const client = await prisma.client.create({
          data: {
            ...clientData,
            userId: adminUser.id
          }
        })
        console.log(`✅ Cliente criado: ${client.name}`)

        // Criar um agente para cada cliente
        await prisma.agent.create({
          data: {
            name: `Agente ${client.name}`,
            description: `Agente de IA para ${client.company || client.name}`,
            model: 'gpt-4',
            isActive: true,
            clientId: client.id,
            userId: adminUser.id,
            config: {
              temperature: 0.7,
              maxTokens: 1500
            }
          }
        })
        console.log(`✅ Agente criado para ${client.name}`)

        // Criar alguns documentos de teste
        await prisma.document.create({
          data: {
            fileName: `documento-${client.id}.pdf`,
            originalName: `Requisitos ${client.name}.pdf`,
            mimeType: 'application/pdf',
            size: 1024000,
            status: 'COMPLETED',
            extractedText: `Requisitos do projeto para ${client.company || client.name}`,
            confidence: 95.5,
            processingTime: 2500,
            clientId: client.id,
            metadata: {
              pages: 5,
              language: 'pt'
            }
          }
        })

        // Criar um orçamento de teste
        const budget = await prisma.budget.create({
          data: {
            title: `Orçamento ${client.company || client.name}`,
            description: `Proposta comercial para ${client.name}`,
            value: Math.floor(Math.random() * 50000) + 10000,
            status: Math.random() > 0.5 ? 'APPROVED' : 'SENT',
            clientId: client.id,
            metadata: {
              validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              currency: 'BRL'
            }
          }
        })

        // Criar itens do orçamento
        await prisma.budgetItem.create({
          data: {
            description: 'Desenvolvimento de sistema',
            quantity: 1,
            unitPrice: budget.value * 0.7,
            totalPrice: budget.value * 0.7,
            budgetId: budget.id
          }
        })

        await prisma.budgetItem.create({
          data: {
            description: 'Suporte técnico',
            quantity: 3,
            unitPrice: budget.value * 0.1,
            totalPrice: budget.value * 0.3,
            budgetId: budget.id
          }
        })

        console.log(`✅ Orçamento criado para ${client.name}`)
      } else {
        console.log(`⚠️  Cliente já existe: ${clientData.name}`)
      }
    }

    console.log('\n🎉 Dados de teste criados com sucesso!')
    
    // Mostrar estatísticas
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.client.count(),
      prisma.agent.count(),
      prisma.document.count(),
      prisma.budget.count()
    ])

    console.log('\n📊 Estatísticas atuais:')
    console.log(`- Usuários: ${stats[0]}`)
    console.log(`- Clientes: ${stats[1]}`)
    console.log(`- Agentes: ${stats[2]}`)
    console.log(`- Documentos: ${stats[3]}`)
    console.log(`- Orçamentos: ${stats[4]}`)

  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestData()