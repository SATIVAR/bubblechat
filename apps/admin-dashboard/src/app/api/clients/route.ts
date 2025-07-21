import { NextResponse } from 'next/server'
import { prisma } from '@bubblechat/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Construir filtros de busca
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { company: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {}

    // Buscar clientes com paginação
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              agents: true,
              documents: true,
              budgets: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.client.count({ where })
    ])

    // Calcular estatísticas adicionais para cada cliente
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const [lastDocument, totalBudgetValue, activeBudgets] = await Promise.all([
          prisma.document.findFirst({
            where: { clientId: client.id },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true }
          }),
          prisma.budget.aggregate({
            where: { clientId: client.id, status: 'APPROVED' },
            _sum: { value: true }
          }),
          prisma.budget.count({
            where: { clientId: client.id, status: { in: ['DRAFT', 'SENT'] } }
          })
        ])

        return {
          ...client,
          stats: {
            agents: client._count?.agents || 0,
            documents: client._count?.documents || 0,
            budgets: client._count?.budgets || 0,
            totalValue: totalBudgetValue._sum?.value || 0,
            activeBudgets: activeBudgets || 0,
            lastActivity: lastDocument?.createdAt || client.createdAt
          }
        }
      })
    )

    return NextResponse.json({
      clients: clientsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, whatsapp, website, userId } = body

    // Validar dados obrigatórios
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingClient = await prisma.client.findUnique({
      where: { email }
    })

    if (existingClient) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      )
    }

    // Buscar um usuário admin existente para associar ao cliente
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Usuário administrador não encontrado' },
        { status: 500 }
      )
    }

    // Criar novo cliente
    const client = await prisma.client.create({
      data: {
        name,
        email,
        company,
        phone,
        whatsapp,
        website,
        userId: userId || adminUser.id
      },
      include: {
        _count: {
          select: {
            agents: true,
            documents: true,
            budgets: true
          }
        }
      }
    })

    // Adicionar estrutura stats para o novo cliente
    const clientWithStats = {
      ...client,
      stats: {
        agents: client._count?.agents || 0,
        documents: client._count?.documents || 0,
        budgets: client._count?.budgets || 0,
        totalValue: 0,
        activeBudgets: 0,
        lastActivity: client.createdAt
      }
    }

    return NextResponse.json(clientWithStats, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}