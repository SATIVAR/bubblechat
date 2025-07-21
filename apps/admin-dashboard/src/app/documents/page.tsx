'use client'

import { useState } from 'react'
import { useDocuments } from '@/hooks/useDocuments'
import { useClients } from '@/hooks/useClients'
import { motion } from 'framer-motion'
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  FileImage,
  FilePdf,
  FileSpreadsheet,
  File,
  Eye,
  Download,
  Search,
  Filter,
  Plus,
  Trash2
} from 'lucide-react'

// Componente para estatísticas de documentos
function DocumentStats() {
  const { documents, pagination, loading, error } = useDocuments({
    limit: 100, // Buscar mais documentos para estatísticas precisas
    autoFetch: true
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
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
  const totalDocuments = pagination.total
  const completedDocuments = documents.filter(doc => doc.status === 'COMPLETED').length
  const processingDocuments = documents.filter(doc => doc.status === 'PROCESSING').length
  const errorDocuments = documents.filter(doc => doc.status === 'ERROR').length
  
  // Calcular taxa de sucesso
  const successRate = totalDocuments > 0 ? (completedDocuments / totalDocuments) * 100 : 0

  const statsData = [
    { 
      title: 'Documentos Processados', 
      value: completedDocuments.toString(),
      subtext: `${successRate.toFixed(1)}% de taxa de sucesso`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Em Processamento', 
      value: processingDocuments.toString(),
      subtext: 'Aguardando conclusão',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      title: 'Erros de Processamento', 
      value: errorDocuments.toString(),
      subtext: 'Necessitam atenção',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Componente para lista de documentos
function DocumentList() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<string | null>(null)
  const [clientId, setClientId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { documents, pagination, loading, error, fetchDocuments } = useDocuments({
    page,
    limit: 10,
    status: status || undefined,
    clientId: clientId || undefined,
    autoFetch: true
  })
  
  const { clients } = useClients({ autoFetch: true })

  const handleSearch = () => {
    fetchDocuments({ page: 1 })
  }

  const handleFilterChange = (newStatus: string | null, newClientId: string | null) => {
    setStatus(newStatus)
    setClientId(newClientId)
    setPage(1)
    fetchDocuments({ 
      page: 1, 
      status: newStatus || undefined, 
      clientId: newClientId || undefined 
    })
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchDocuments({ 
      page: newPage, 
      status: status || undefined, 
      clientId: clientId || undefined 
    })
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FileImage className="h-5 w-5 text-blue-500" />
    if (mimeType === 'application/pdf') return <FilePdf className="h-5 w-5 text-red-500" />
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    }
    return <File className="h-5 w-5 text-gray-500" />
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

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Documentos</h2>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar documentos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none w-full"
                value={status || ''}
                onChange={(e) => handleFilterChange(e.target.value || null, clientId)}
              >
                <option value="">Todos os status</option>
                <option value="COMPLETED">Concluídos</option>
                <option value="PROCESSING">Em processamento</option>
                <option value="ERROR">Com erro</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none w-full"
                value={clientId || ''}
                onChange={(e) => handleFilterChange(status, e.target.value || null)}
              >
                <option value="">Todos os clientes</option>
                {clients?.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.company ? `(${client.company})` : ''}
                  </option>
                ))}
              </select>
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 flex justify-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">Erro ao carregar documentos: {error}</span>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum documento encontrado</h3>
          <p className="text-gray-500">Faça upload de documentos na seção de processamento.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamanho
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(doc.mimeType)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {doc.originalName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {doc.stats.budgetsGenerated} orçamentos gerados
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.client.name}</div>
                      <div className="text-xs text-gray-500">{doc.client.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(doc.createdAt).toLocaleTimeString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.stats.sizeFormatted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(page - 1) * pagination.limit + 1}</span> a <span className="font-medium">
                  {Math.min(page * pagination.limit, pagination.total)}
                </span> de <span className="font-medium">{pagination.total}</span> resultados
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                >
                  Anterior
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  // Lógica para mostrar páginas ao redor da página atual
                  let pageNum = i + 1;
                  if (pagination.pages > 5) {
                    if (page > 3) {
                      pageNum = page - 3 + i;
                    }
                    if (pageNum > pagination.pages) {
                      pageNum = pagination.pages - (4 - i);
                    }
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm ${pageNum === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.pages}
                  className={`px-3 py-1 rounded-md text-sm ${page === pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <DocumentStats />
      <DocumentList />
    </div>
  )
}