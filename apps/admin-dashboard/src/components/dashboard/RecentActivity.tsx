'use client'

import { Clock, User, FileText, Calculator, Loader2, AlertCircle } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function RecentActivity() {
  const { recentActivity, loading, error } = useDashboardStats()

  // Função para formatar o tempo relativo
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    } catch (e) {
      return 'data desconhecida'
    }
  }

  // Função para obter ícone e cores com base no tipo de atividade
  const getActivityMeta = (type: string) => {
    switch (type) {
      case 'document':
        return {
          icon: FileText,
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
        }
      case 'budget':
        return {
          icon: Calculator,
          iconColor: 'text-green-600',
          iconBg: 'bg-green-100',
        }
      case 'client':
        return {
          icon: User,
          iconColor: 'text-purple-600',
          iconBg: 'bg-purple-100',
        }
      default:
        return {
          icon: Clock,
          iconColor: 'text-gray-600',
          iconBg: 'bg-gray-100',
        }
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Atividade Recente</h3>
        </div>
        <div className="p-6 flex justify-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Atividade Recente</h3>
        </div>
        <div className="p-6 bg-red-50">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">Erro ao carregar atividades: {error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Atividade Recente</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {recentActivity && recentActivity.length > 0 ? recentActivity.map((activity) => {
          const meta = getActivityMeta(activity.type)
          return (
          <div key={activity.id} className="px-6 py-4">
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${meta.iconBg}`}>
                <meta.icon className={`w-4 h-4 ${meta.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.description}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatRelativeTime(activity.createdAt)}
                </div>
              </div>
            </div>
          </div>
        }) : (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 text-sm">Nenhuma atividade recente encontrada</p>
          </div>
        )}
      </div>
      <div className="px-6 py-3 bg-gray-50 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
          Ver todas as atividades
        </button>
      </div>
    </div>
  )
}