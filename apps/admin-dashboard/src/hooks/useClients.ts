import { useState, useEffect } from 'react'

interface Client {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  whatsapp?: string
  website?: string
  createdAt: string
  updatedAt: string
  stats: {
    agents: number
    documents: number
    budgets: number
    totalValue: number
    activeBudgets: number
    lastActivity: string
  }
}

interface ClientsResponse {
  clients: Client[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface UseClientsOptions {
  page?: number
  limit?: number
  search?: string
  autoFetch?: boolean
}

export function useClients(options: UseClientsOptions = {}) {
  const { page = 1, limit = 10, search = '', autoFetch = true } = options
  
  const [data, setData] = useState<ClientsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async (params?: { page?: number; limit?: number; search?: string }) => {
    try {
      setLoading(true)
      setError(null)
      
      const searchParams = new URLSearchParams({
        page: String(params?.page || page),
        limit: String(params?.limit || limit),
        ...(params?.search || search ? { search: params?.search || search } : {})
      })
      
      const response = await fetch(`/api/clients?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar clientes')
      }
      
      const result = await response.json()
      
      // Garantir que todos os clientes tenham a estrutura stats
      const clientsWithStats = result.clients?.map((client: any) => ({
        ...client,
        stats: client.stats || {
          agents: 0,
          documents: 0,
          budgets: 0,
          totalValue: 0,
          activeBudgets: 0,
          lastActivity: client.createdAt
        }
      })) || []
      
      setData({
        ...result,
        clients: clientsWithStats
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  const createClient = async (clientData: {
    name: string
    email: string
    company?: string
    phone?: string
    whatsapp?: string
    website?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar cliente')
      }
      
      const newClient = await response.json()
      
      // Garantir que o novo cliente tenha a estrutura stats
      const clientWithStats = {
        ...newClient,
        stats: newClient.stats || {
          agents: 0,
          documents: 0,
          budgets: 0,
          totalValue: 0,
          activeBudgets: 0,
          lastActivity: newClient.createdAt
        }
      }
      
      // Atualizar a lista local
      if (data) {
        setData({
          ...data,
          clients: [clientWithStats, ...data.clients],
          pagination: {
            ...data.pagination,
            total: data.pagination.total + 1
          }
        })
      }
      
      return newClient
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchClients()
    }
  }, [page, limit, search, autoFetch])

  const refresh = () => {
    fetchClients()
  }

  const searchClients = (searchTerm: string) => {
    fetchClients({ search: searchTerm, page: 1 })
  }

  const updateClient = async (id: string, clientData: {
    name: string
    email: string
    company?: string
    phone?: string
    whatsapp?: string
    website?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar cliente')
      }
      
      const updatedClient = await response.json()
      
      // Garantir que o cliente atualizado tenha a estrutura stats
      const clientWithStats = {
        ...updatedClient,
        stats: updatedClient.stats || {
          agents: 0,
          documents: 0,
          budgets: 0,
          totalValue: 0,
          activeBudgets: 0,
          lastActivity: updatedClient.createdAt
        }
      }
      
      // Atualizar a lista local
      if (data) {
        setData({
          ...data,
          clients: data.clients.map(client => 
            client.id === id ? { ...client, ...clientWithStats } : client
          )
        })
      }
      
      return updatedClient
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteClient = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir cliente')
      }
      
      // Remover da lista local
      if (data) {
        setData({
          ...data,
          clients: data.clients.filter(client => client.id !== id),
          pagination: {
            ...data.pagination,
            total: data.pagination.total - 1
          }
        })
      }
      
      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getClientById = async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar cliente')
      }
      
      return await response.json()
    } catch (err) {
      console.error('Erro ao buscar cliente:', err)
      throw err
    }
  }

  const changePage = (newPage: number) => {
    fetchClients({ page: newPage })
  }

  return {
    clients: data?.clients || [],
    pagination: data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    refresh,
    searchClients,
    changePage
  }
}