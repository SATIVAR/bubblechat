import { NextResponse } from 'next/server'
import { prisma } from '@bubblechat/database'

export async function GET() {
  try {
    // Buscar estatísticas reais do banco de dados
    const [
      totalClients,
      totalAgents,
      totalDocuments,
      totalBudgets,
      recentDocuments,
      budgetsByStatus,
      documentsByStatus,
      monthlyStats
    ] = await Promise.all([
      // Total de clientes
      prisma.client.count(),
      
      // Total de agentes
      prisma.agent.count(),
      
      // Total de documentos
      prisma.document.count(),
      
      // Total de orçamentos
      prisma.budget.count(),
      
      // Documentos recentes (últimos 7 dias)
      prisma.document.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Orçamentos por status
      prisma.budget.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      }),
      
      // Documentos por status
      prisma.document.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      }),
      
      // Estatísticas mensais (últimos 6 meses)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as count,
          'documents' as type
        FROM documents 
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `
    ])

    // Calcular métricas derivadas
    const activeAgents = await prisma.agent.count({
      where: { isActive: true }
    })

    const approvedBudgets = budgetsByStatus.find(b => b.status === 'APPROVED')?._count.id || 0
    const totalBudgetValue = await prisma.budget.aggregate({
      _sum: { value: true },
      where: { status: 'APPROVED' }
    })

    const completedDocuments = documentsByStatus.find(d => d.status === 'COMPLETED')?._count.id || 0
    const processingDocuments = documentsByStatus.find(d => d.status === 'PROCESSING')?._count.id || 0

    // Calcular tendências (comparar com período anterior)
    const previousPeriodClients = await prisma.client.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })

    const clientsTrend = previousPeriodClients > 0 
      ? ((totalClients - previousPeriodClients) / previousPeriodClients) * 100 
      : 0

    const stats = {
      overview: {
        totalClients,
        totalAgents,
        activeAgents,
        totalDocuments,
        totalBudgets,
        recentDocuments,
        trends: {
          clients: clientsTrend,
          documents: recentDocuments > 0 ? 15.2 : 0, // Placeholder para cálculo real
          budgets: approvedBudgets > 0 ? 8.7 : 0,
          revenue: totalBudgetValue._sum.value || 0
        }
      },
      budgets: {
        total: totalBudgets,
        approved: approvedBudgets,
        totalValue: totalBudgetValue._sum.value || 0,
        byStatus: budgetsByStatus.map(b => ({
          status: b.status,
          count: b._count.id
        }))
      },
      documents: {
        total: totalDocuments,
        completed: completedDocuments,
        processing: processingDocuments,
        byStatus: documentsByStatus.map(d => ({
          status: d.status,
          count: d._count.id
        }))
      },
      monthly: monthlyStats
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}