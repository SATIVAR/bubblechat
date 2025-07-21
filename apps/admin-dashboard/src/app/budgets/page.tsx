'use client'

import { useState } from 'react'
import { useBudgets } from '@/hooks/useBudgets'
import { useClients } from '@/hooks/useClients'
import { motion } from 'framer-motion'
import { 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Clock,
  Plus,
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
  Loader2,
  Download,
  Send,
  Check,
  X
} from 'lucide-react'

// Componente para estatísticas de orçamentos
function BudgetStats() {
  const { budgets, pagination, loading, error } = useBudgets({
    limit: 100, // Buscar mais orçamentos para estatísticas precisas
    autoFetch: true
  })

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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Erro ao carregar estatísticas: {error}</span>
        </div>
      </div>
    )
  }

  // Calcular estatísticas
  const totalBudgets = pagination.total
  const totalValue = budgets.reduce((sum, budget) => sum + budget.value, 0)
  const approvedBudgets = budgets.filter(budget => budget.status === 'APPROVED').length
  const approvalRate = totalBudgets > 0 ? (approvedBudgets / totalBudgets) * 100 : 0
  
  // Calcular tempo médio (simulado)
  const avgProcessingTime = '3.2min'

  const statsData = [
    { 
      title: 'Orçamentos Gerados', 
      value: totalBudgets.toString(), 
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Valor Total', 
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(totalValue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Taxa de Aprovação', 
      value: `${approvalRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      title: 'Tempo Médio', 
      value: avgProcessingTime,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Componente para lista de orçamentos
function BudgetList() {
  const { budgets, pagination, loading, error, filterByStatus, changePage, updateBudgetStatus } = useBudgets()
  const { clients } = useClients({ autoFetch: true })
  const [statusFilter, setStatusFilter] = useState('')

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    filterByStatus(status)
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateBudgetStatus(id, newStatus)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Rascunho</span>
      case 'SENT':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Enviado</span>
      case 'APPROVED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aprovado</span>
      case 'REJECTED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Rejeitado</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{status}</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Orçamentos ({pagination.total})
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter ? `Status: ${statusFilter}` : 'Filtrar por Status'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200 hidden">
              <div className="py-1">
                <button 
                  onClick={() => handleStatusChange('')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Todos
                </button>
                <button 
                  onClick={() => handleStatusChange('DRAFT')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Rascunho
                </button>
                <button 
                  onClick={() => handleStatusChange('SENT')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Enviado
                </button>
                <button 
                  onClick={() => handleStatusChange('APPROVED')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Aprovado
                </button>
                <button 
                  onClick={() => handleStatusChange('REJECTED')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Rejeitado
                </button>
              </div>
            </div>
          </div>
          
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Carregando orçamentos...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Erro ao carregar orçamentos</p>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      ) : budgets.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum orçamento encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgets.map((budget) => (
                <tr key={budget.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{budget.title}</div>
                    <div className="text-sm text-gray-500">{budget.items.length} itens</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{budget.client.name}</div>
                    <div className="text-sm text-gray-500">{budget.client.company || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{budget.stats.formattedValue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(budget.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(budget.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Baixar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      
                      {budget.status === 'DRAFT' && (
                        <button 
                          onClick={() => handleStatusUpdate(budget.id, 'SENT')}
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Enviar orçamento"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      
                      {budget.status === 'SENT' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(budget.id, 'APPROVED')}
                            className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                            title="Marcar como aprovado"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(budget.id, 'REJECTED')}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Marcar como rejeitado"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} orçamentos
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => changePage(i + 1)}
                  className={`px-3 py-2 border rounded-lg text-sm ${
                    pagination.page === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function BudgetsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Orçamentos
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Gerencie orçamentos gerados automaticamente a partir de documentos
        </p>
      </motion.div>
      
      {/* Cards de estatísticas */}
      <BudgetStats />
      
      {/* Lista de orçamentos */}
      <BudgetList />
    </motion.div>
  )
}