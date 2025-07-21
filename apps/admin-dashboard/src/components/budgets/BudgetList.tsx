'use client'

import { useState } from 'react'
import { Eye, Download, Edit, Trash2, FileText, DollarSign } from 'lucide-react'

interface Budget {
  id: string
  title: string
  client: string
  value: number
  status: 'draft' | 'sent' | 'approved' | 'rejected'
  createdAt: string
  documentSource: string
  items: number
}

const mockBudgets: Budget[] = [
  {
    id: '1',
    title: 'Sistema de Gestão Empresarial',
    client: 'Empresa ABC Ltda',
    value: 85000,
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    documentSource: 'especificacoes_sistema.pdf',
    items: 12
  },
  {
    id: '2',
    title: 'Desenvolvimento de App Mobile',
    client: 'Startup XYZ',
    value: 45000,
    status: 'sent',
    createdAt: '2024-01-14T15:20:00Z',
    documentSource: 'requisitos_app.docx',
    items: 8
  },
  {
    id: '3',
    title: 'Consultoria em Infraestrutura',
    client: 'TechCorp Solutions',
    value: 120000,
    status: 'draft',
    createdAt: '2024-01-14T09:45:00Z',
    documentSource: 'analise_infraestrutura.xlsx',
    items: 15
  }
]

export function BudgetList() {
  const [budgets] = useState<Budget[]>(mockBudgets)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800' },
      sent: { label: 'Enviado', color: 'bg-blue-100 text-blue-800' },
      approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Lista de Orçamentos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {budgets.map((budget) => (
            <li key={budget.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {budget.title}
                        </p>
                        <div className="ml-2">
                          {getStatusBadge(budget.status)}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{budget.client}</span>
                        <span className="mx-2">•</span>
                        <span>{budget.items} itens</span>
                        <span className="mx-2">•</span>
                        <span>Baseado em: {budget.documentSource}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        Criado em {formatDate(budget.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center text-lg font-semibold text-gray-900">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatCurrency(budget.value)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-md">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Paginação */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Anterior
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Próximo
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">3</span> de{' '}
              <span className="font-medium">3</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Anterior
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Próximo
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}