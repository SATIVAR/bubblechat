'use client'

import { useState } from 'react'
import { FileText, Image, FileSpreadsheet, Download, Eye, Trash2, Search, Loader2, AlertCircle, Users } from 'lucide-react'
import { useDocuments } from '@/hooks/useDocuments'
import { useClients } from '@/hooks/useClients'



export function ProcessingHistory() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterClientId, setFilterClientId] = useState<string | null>(null)
  
  // Buscar documentos com paginação e filtros
  const { 
    documents, 
    pagination, 
    loading, 
    error, 
    fetchDocuments 
  } = useDocuments({
    page,
    limit: 10,
    status: filterStatus || undefined,
    clientId: filterClientId || undefined,
    autoFetch: true
  })
  
  // Buscar clientes para o filtro
  const { clients, loading: loadingClients } = useClients({ autoFetch: true })

  // Aplicar filtro de busca local (o filtro de status e cliente já é aplicado na API)
  const filteredDocuments = documents.filter(doc => {
    if (!searchTerm) return true
    
    return (
      doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.company?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image
    if (mimeType === 'application/pdf') return FileText
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') {
      return FileSpreadsheet
    }
    return FileText
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Concluído</span>
      case 'PROCESSING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Processando</span>
      case 'ERROR':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Erro</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Desconhecido</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  // Aplicar filtros e buscar novamente
  const handleFilterChange = () => {
    setPage(1)
    fetchDocuments({
      page: 1,
      status: filterStatus || undefined,
      clientId: filterClientId || undefined
    })
  }
  
  // Mudar de página
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchDocuments({
      page: newPage,
      status: filterStatus || undefined,
      clientId: filterClientId || undefined
    })
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome do arquivo ou cliente..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={filterStatus || ''}
          onChange={(e) => {
            setFilterStatus(e.target.value || null)
            handleFilterChange()
          }}
        >
          <option value="">Todos os status</option>
          <option value="COMPLETED">Concluídos</option>
          <option value="PROCESSING">Em processamento</option>
          <option value="ERROR">Com erro</option>
        </select>
        
        <select
          className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={filterClientId || ''}
          onChange={(e) => {
            setFilterClientId(e.target.value || null)
            handleFilterChange()
          }}
          disabled={loadingClients}
        >
          <option value="">Todos os clientes</option>
          {clients?.map(client => (
            <option key={client.id} value={client.id}>
              {client.name} {client.company ? `(${client.company})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-8 flex justify-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Erro ao carregar documentos: {error}</span>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredDocuments.map((doc) => {
              const FileIcon = getFileIcon(doc.mimeType)
              
              return (
                <li key={doc.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {doc.originalName}
                          </p>
                          <div className="ml-2">
                            {getStatusBadge(doc.status)}
                          </div>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{formatDate(doc.createdAt)}</span>
                          {doc.client && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{doc.client.name} {doc.client.company ? `(${doc.client.company})` : ''}</span>
                            </>
                          )}
                          <span className="mx-2">•</span>
                          <span>{doc.stats.processingTimeFormatted}</span>
                          {doc.stats.confidencePercentage && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Confiança: {doc.stats.confidencePercentage}%</span>
                            </>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          {doc.stats.sizeFormatted}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum documento encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar os filtros ou fazer upload de novos documentos.
              </p>
            </div>
          )}
          
          {/* Paginação */}
          {pagination && pagination.pages > 1 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(page - 1) * pagination.limit + 1}</span> a <span className="font-medium">
                    {Math.min(page * pagination.limit, pagination.total)}
                  </span> de <span className="font-medium">{pagination.total}</span> resultados
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.pages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}