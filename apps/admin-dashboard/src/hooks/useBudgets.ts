import { useState, useEffect } from 'react'

interface BudgetItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface Budget {
  id: string
  title: string
  description?: string
  value: number
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED'
  metadata?: any
  createdAt: string
  updatedAt: string
  client: {
    id: string
    name: string
    email: string
    company?: string
  }
  document?: {
    id: string
    originalName: string
    mimeType: string
  }
  items: BudgetItem[]
  stats: {
    itemsCount: number
    averageItemValue: number
    formattedValue: string
    daysOld: number
  }
}

interface BudgetsResponse {
  budgets: Budget[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface UseBudgetsOptions {
  page?: number
  limit?: number
  status?: string
  clientId?: string
  autoFetch?: boolean
}

export function useBudgets(options: UseBudgetsOptions = {}) {
  const { page = 1, limit = 10, status, clientId, autoFetch = true } = options
  
  const [data, setData] = useState<BudgetsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBudgets = async (params?: UseBudgetsOptions) => {
    try {
      setLoading(true)
      setError(null)
      
      const searchParams = new URLSearchParams({
        page: String(params?.page || page),
        limit: String(params?.limit || limit),
        ...(params?.status || status ? { status: params?.status || status } : {}),
        ...(params?.clientId || clientId ? { clientId: params?.clientId || clientId } : {})
      })
      
      const response = await fetch(`/api/budgets?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar orçamentos')
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar orçamentos:', err)
    } finally {
      setLoading(false)
    }
  }

  const createBudget = async (budgetData: {
    title: string
    description?: string
    clientId: string
    documentId?: string
    items: Array<{
      description: string
      quantity: number
      unitPrice: number
    }>
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(budgetData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar orçamento')
      }
      
      const newBudget = await response.json()
      
      // Atualizar a lista local
      if (data) {
        setData({
          ...data,
          budgets: [newBudget, ...data.budgets],
          pagination: {
            ...data.pagination,
            total: data.pagination.total + 1
          }
        })
      }
      
      return newBudget
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBudgetStatus = async (id: string, status: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/budgets', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar orçamento')
      }
      
      const updatedBudget = await response.json()
      
      // Atualizar a lista local
      if (data) {
        setData({
          ...data,
          budgets: data.budgets.map(budget => 
            budget.id === id ? { ...budget, ...updatedBudget } : budget
          )
        })
      }
      
      return updatedBudget
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getBudgetById = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar orçamento')
      }
      
      return await response.json()
    } catch (err) {
      console.error('Erro ao buscar orçamento:', err)
      throw err
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchBudgets()
    }
  }, [page, limit, status, clientId, autoFetch])

  const refresh = () => {
    fetchBudgets()
  }

  const filterByStatus = (newStatus: string) => {
    fetchBudgets({ status: newStatus, page: 1 })
  }

  const filterByClient = (newClientId: string) => {
    fetchBudgets({ clientId: newClientId, page: 1 })
  }

  const changePage = (newPage: number) => {
    fetchBudgets({ page: newPage })
  }

  return {
    budgets: data?.budgets || [],
    pagination: data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudgetStatus,
    getBudgetById,
    refresh,
    filterByStatus,
    filterByClient,
    changePage
  }
}