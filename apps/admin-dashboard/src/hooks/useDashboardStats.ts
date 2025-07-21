import { useState, useEffect } from 'react'

interface DashboardStats {
  overview: {
    totalClients: number
    totalAgents: number
    activeAgents: number
    totalDocuments: number
    totalBudgets: number
    recentDocuments: number
    trends: {
      clients: number
      documents: number
      budgets: number
      revenue: number
    }
  }
  budgets: {
    total: number
    approved: number
    totalValue: number
    byStatus: Array<{
      status: string
      count: number
    }>
  }
  documents: {
    total: number
    completed: number
    processing: number
    byStatus: Array<{
      status: string
      count: number
    }>
  }
  monthly: Array<{
    month: string
    count: number
    type: string
  }>
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar estatísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const refresh = () => {
    fetchStats()
  }

  return {
    stats,
    loading,
    error,
    refresh
  }
}