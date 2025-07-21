'use client'

import { Users, Bot, FileText, TrendingUp, Loader2, AlertCircle } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useDashboardStats'

export function DashboardStats() {
  const { stats: dashboardStats, loading, error } = useDashboardStats()

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-5 animate-pulse">
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Erro ao carregar estatísticas: {error}</span>
        </div>
      </div>
    )
  }

  // Preparar os dados para exibição
  const stats = [
    {
      name: 'Total de Clientes',
      value: dashboardStats?.totalClients.toString() || '0',
      change: dashboardStats?.clientsGrowth || '0%',
      changeType: dashboardStats?.clientsGrowthType || 'neutral',
      icon: Users,
    },
    {
      name: 'Agentes Ativos',
      value: dashboardStats?.totalAgents.toString() || '0',
      change: dashboardStats?.agentsGrowth || '0%',
      changeType: dashboardStats?.agentsGrowthType || 'neutral',
      icon: Bot,
    },
    {
      name: 'Documentos Processados',
      value: dashboardStats?.totalDocuments.toString() || '0',
      change: dashboardStats?.documentsGrowth || '0%',
      changeType: dashboardStats?.documentsGrowthType || 'neutral',
      icon: FileText,
    },
    {
      name: 'Taxa de Conversão',
      value: dashboardStats?.conversionRate || '0%',
      change: dashboardStats?.conversionRateGrowth || '0%',
      changeType: dashboardStats?.conversionRateGrowthType || 'neutral',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${{
                      'increase': 'text-green-600',
                      'decrease': 'text-red-600',
                      'neutral': 'text-gray-500'
                    }[stat.changeType] || 'text-gray-500'}`}>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}