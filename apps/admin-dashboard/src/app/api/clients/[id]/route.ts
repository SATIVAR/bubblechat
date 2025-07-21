import { NextResponse } from 'next/server'
import { prisma } from '@bubblechat/database'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
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

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Calcular estatísticas adicionais
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

    const clientWithStats = {
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

    return NextResponse.json(clientWithStats)
  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, email, company, phone, whatsapp, website } = body

    // Validar dados obrigatórios
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o cliente existe
    const existingClient = await prisma.client.findUnique({
      where: { id: params.id }
    })

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se email já está em uso por outro cliente
    const emailInUse = await prisma.client.findFirst({
      where: { 
        email,
        id: { not: params.id }
      }
    })

    if (emailInUse) {
      return NextResponse.json(
        { error: 'Email já está em uso por outro cliente' },
        { status: 400 }
      )
    }

    // Atualizar cliente
    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: {
        name,
        email,
        company,
        phone,
        whatsapp,
        website,
        updatedAt: new Date()
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

    // Calcular estatísticas adicionais para o cliente atualizado
    const [lastDocument, totalBudgetValue, activeBudgets] = await Promise.all([
      prisma.document.findFirst({
        where: { clientId: updatedClient.id },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      }),
      prisma.budget.aggregate({
        where: { clientId: updatedClient.id, status: 'APPROVED' },
        _sum: { value: true }
      }),
      prisma.budget.count({
        where: { clientId: updatedClient.id, status: { in: ['DRAFT', 'SENT'] } }
      })
    ])

    const clientWithStats = {
      ...updatedClient,
      stats: {
        agents: updatedClient._count?.agents || 0,
        documents: updatedClient._count?.documents || 0,
        budgets: updatedClient._count?.budgets || 0,
        totalValue: totalBudgetValue._sum?.value || 0,
        activeBudgets: activeBudgets || 0,
        lastActivity: lastDocument?.createdAt || updatedClient.createdAt
      }
    }

    return NextResponse.json(clientWithStats)
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o cliente existe
    const existingClient = await prisma.client.findUnique({
      where: { id: params.id },
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

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há dados relacionados
    const hasRelatedData = existingClient._count.agents > 0 || 
                          existingClient._count.documents > 0 || 
                          existingClient._count.budgets > 0

    if (hasRelatedData) {
      return NextResponse.json(
        { 
          error: 'Não é possível excluir cliente com dados relacionados',
          details: {
            agents: existingClient._count.agents,
            documents: existingClient._count.documents,
            budgets: existingClient._count.budgets
          }
        },
        { status: 400 }
      )
    }

    // Excluir cliente
    await prisma.client.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: 'Cliente excluído com sucesso',
      deletedClient: {
        id: existingClient.id,
        name: existingClient.name,
        email: existingClient.email
      }
    })
  } catch (error) {
    console.error('Erro ao excluir cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}