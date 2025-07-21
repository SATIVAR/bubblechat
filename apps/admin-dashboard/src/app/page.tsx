'use client'

import { useDashboardStats } from '@/hooks/useDashboardStats'
import { StatsGrid } from '@/components/ui/stats-card'
import { Users, Bot, FileText, TrendingUp, DollarSign, Clock, Target, Zap, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

// Componente para estatísticas modernas com dados reais
function DashboardStats() {
  const { stats, loading, error } = useDashboardStats()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Erro ao carregar estatísticas: {error}</span>
        </div>
      </div>
    )
  }

  const statsData = [
    { 
      title: 'Total de Clientes', 
      value: stats.overview.totalClients.toString(), 
      change: `${stats.overview.trends.clients > 0 ? '+' : ''}${stats.overview.trends.clients.toFixed(1)}%`,
      changeType: stats.overview.trends.clients >= 0 ? 'positive' as const : 'negative' as const,
      icon: Users,
      description: 'novos este mês'
    },
    { 
      title: 'Agentes Ativos', 
      value: stats.overview.activeAgents.toString(), 
      change: `${stats.overview.totalAgents} total`,
      changeType: 'neutral' as const,
      icon: Bot,
      description: 'em operação'
    },
    { 
      title: 'Documentos Processados', 
      value: stats.overview.totalDocuments.toString(), 
      change: `${stats.overview.recentDocuments} recentes`,
      changeType: stats.overview.recentDocuments > 0 ? 'positive' as const : 'neutral' as const,
      icon: FileText,
      description: 'esta semana'
    },
    { 
      title: 'Orçamentos Gerados', 
      value: stats.overview.totalBudgets.toString(), 
      change: `R$ ${(stats.budgets.totalValue / 1000).toFixed(0)}k`,
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'valor total'
    },
  ]

  return <StatsGrid stats={statsData} />
}

// Componente para atividade recente com dados reais
function RecentActivity() {
  const { stats, loading } = useDashboardStats()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document_processed': return <FileText className="h-4 w-4 text-blue-600" />
      case 'budget_generated': return <DollarSign className="h-4 w-4 text-green-600" />
      case 'client_added': return <Users className="h-4 w-4 text-purple-600" />
      case 'agent_configured': return <Bot className="h-4 w-4 text-orange-600" />
      default: return <Zap className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'agora'
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }

  // Simular atividades baseadas nos dados reais
  const generateRecentActivities = () => {
    if (!stats) return []
    
    const activities = []
    
    if (stats.documents.processing > 0) {
      activities.push({
        id: '1',
        type: 'document_processed',
        title: 'Documentos em processamento',
        description: `${stats.documents.processing} documentos sendo processados`,
        timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 min atrás
      })
    }
    
    if (stats.budgets.approved > 0) {
      activities.push({
        id: '2',
        type: 'budget_generated',
        title: 'Orçamentos aprovados',
        description: `${stats.budgets.approved} orçamentos foram aprovados`,
        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 min atrás
      })
    }
    
    if (stats.overview.totalClients > 0) {
      activities.push({
        id: '3',
        type: 'client_added',
        title: 'Novos clientes',
        description: `${stats.overview.totalClients} clientes cadastrados no sistema`,
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 min atrás
      })
    }
    
    if (stats.overview.activeAgents > 0) {
      activities.push({
        id: '4',
        type: 'agent_configured',
        title: 'Agentes configurados',
        description: `${stats.overview.activeAgents} agentes ativos no sistema`,
        timestamp: new Date(Date.now() - 60 * 60 * 1000) // 1h atrás
      })
    }
    
    return activities
  }

  const recentActivity = generateRecentActivities()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white shadow-md rounded-xl border-0 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
        <p className="text-sm text-gray-500 mt-1">Últimas ações no sistema</p>
      </div>
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 text-sm mt-2">Carregando atividades...</p>
          </div>
        ) : recentActivity.length > 0 ? (
          recentActivity.map((activity, index) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Nenhuma atividade recente</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Componente para estatísticas de processamento de documentos com dados reais
function DocumentProcessingStats() {
  const { stats, loading } = useDashboardStats()
  
  if (loading || !stats) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white shadow-md rounded-xl border-0 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-semibold text-gray-900">Processamento de Documentos</h3>
          <p className="text-sm text-gray-500 mt-1">Carregando métricas...</p>
        </div>
        <div className="p-6 animate-pulse">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }
  
  const processingStats = [
    { 
      label: 'Total de documentos', 
      value: stats.documents.total.toString(), 
      color: 'text-blue-600' 
    },
    { 
      label: 'Documentos processados', 
      value: stats.documents.completed.toString(), 
      color: 'text-green-600' 
    },
    { 
      label: 'Em processamento', 
      value: stats.documents.processing.toString(), 
      color: 'text-orange-600' 
    },
    { 
      label: 'Orçamentos gerados', 
      value: stats.budgets.total.toString(), 
      color: 'text-purple-600' 
    },
  ]
  
  const successRate = stats.documents.total > 0 
    ? ((stats.documents.completed / stats.documents.total) * 100).toFixed(1)
    : '0'
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white shadow-md rounded-xl border-0 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900">Processamento de Documentos</h3>
        <p className="text-sm text-gray-500 mt-1">Métricas de performance do sistema</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {processingStats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <div>
              <span className="text-sm font-medium text-gray-900">Valor total em orçamentos</span>
              <p className="text-xs text-gray-500 mt-1">Receita potencial gerada</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-600">
                R$ {(stats.budgets.totalValue / 1000).toFixed(0)}k
              </span>
              <p className="text-xs text-green-500">Taxa de sucesso: {successRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header com animação */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Visão geral do sistema e estatísticas principais
        </p>
      </motion.div>
      
      {/* Cards de estatísticas */}
      <DashboardStats />
      
      {/* Grid de conteúdo secundário */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity />
        <DocumentProcessingStats />
      </div>
      
      {/* Seção adicional com métricas avançadas */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Performance IA</p>
              <p className="text-2xl font-bold text-blue-900">98.5%</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-blue-700 text-xs mt-2">Precisão dos agentes</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Tempo Resposta</p>
              <p className="text-2xl font-bold text-purple-900">1.2s</p>
            </div>
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-purple-700 text-xs mt-2">Média de processamento</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Satisfação</p>
              <p className="text-2xl font-bold text-green-900">4.8/5</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-green-700 text-xs mt-2">Avaliação dos clientes</p>
        </div>
      </motion.div>
    </motion.div>
  )
}