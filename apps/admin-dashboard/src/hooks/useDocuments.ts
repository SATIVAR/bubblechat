import { useState, useEffect } from 'react'

interface Document {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  size: number
  status: 'PROCESSING' | 'COMPLETED' | 'ERROR'
  extractedText?: string
  confidence?: number
  processingTime?: number
  metadata?: any
  createdAt: string
  updatedAt: string
  client: {
    id: string
    name: string
    email: string
    company?: string
  }
  stats: {
    budgetsGenerated: number
    processingTimeFormatted?: string
    confidencePercentage?: string
    sizeFormatted: string
  }
}

interface DocumentsResponse {
  documents: Document[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface UseDocumentsOptions {
  page?: number
  limit?: number
  status?: string
  clientId?: string
  autoFetch?: boolean
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const { page = 1, limit = 10, status, clientId, autoFetch = true } = options
  
  const [data, setData] = useState<DocumentsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async (params?: UseDocumentsOptions) => {
    try {
      setLoading(true)
      setError(null)
      
      const searchParams = new URLSearchParams({
        page: String(params?.page || page),
        limit: String(params?.limit || limit),
        ...(params?.status || status ? { status: params?.status || status } : {}),
        ...(params?.clientId || clientId ? { clientId: params?.clientId || clientId } : {})
      })
      
      const response = await fetch(`/api/documents?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar documentos')
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar documentos:', err)
    } finally {
      setLoading(false)
    }
  }

  const uploadDocument = async (file: File, clientId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('clientId', clientId)
      
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer upload do documento')
      }
      
      const newDocument = await response.json()
      
      // Atualizar a lista local
      if (data) {
        setData({
          ...data,
          documents: [newDocument, ...data.documents],
          pagination: {
            ...data.pagination,
            total: data.pagination.total + 1
          }
        })
      }
      
      return newDocument
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDocumentById = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar documento')
      }
      
      return await response.json()
    } catch (err) {
      console.error('Erro ao buscar documento:', err)
      throw err
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchDocuments()
    }
  }, [page, limit, status, clientId, autoFetch])

  const refresh = () => {
    fetchDocuments()
  }

  const filterByStatus = (newStatus: string) => {
    fetchDocuments({ status: newStatus, page: 1 })
  }

  const filterByClient = (newClientId: string) => {
    fetchDocuments({ clientId: newClientId, page: 1 })
  }

  const changePage = (newPage: number) => {
    fetchDocuments({ page: newPage })
  }

  return {
    documents: data?.documents || [],
    pagination: data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    getDocumentById,
    refresh,
    filterByStatus,
    filterByClient,
    changePage
  }
}