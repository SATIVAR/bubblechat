'use client'

import { motion } from 'framer-motion'
import FileUploadZone from '@/components/processing/FileUploadZone'
import { useDocuments } from '@/hooks/useDocuments'
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
  Download
} from 'lucide-react'

// Componente para estatísticas de processamento
function ProcessingStats() {
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
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Componente para histórico de processamento
function ProcessingHistory() {
  const { documents, pagination, loading, error, changePage } = useDocuments({
    limit: 5, // Limitar a 5 documentos por página
    autoFetch: true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center"><Clock className="h-3 w-3 mr-1" /> Processando</span>
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Concluído</span>
      case 'ERROR':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Erro</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{status}</span>
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) {
      return <FileImage className="h-5 w-5 text-blue-600" />
    } else if (mimeType.includes('pdf')) {
      return <FilePdf className="h-5 w-5 text-red-600" />
    } else if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />
    } else {
      return <File className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Histórico de Processamento
        </h3>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Carregando histórico...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Erro ao carregar histórico</p>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum documento processado</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(document.mimeType)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{document.originalName}</h4>
                      {getStatusBadge(document.status)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Cliente: {document.client.name}</span>
                      <span>Tamanho: {document.stats.sizeFormatted}</span>
                      <span>Data: {formatDate(document.createdAt)}</span>
                    </div>
                    
                    {document.status === 'COMPLETED' && (
                      <div className="mt-2 text-xs">
                        <span className="text-green-600">
                          Processado em {document.stats.processingTimeFormatted} • 
                          Confiança: {document.stats.confidencePercentage}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Visualizar documento"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {document.status === 'COMPLETED' && (
                    <button 
                      className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                      title="Baixar texto extraído"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} documentos
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

export default function ProcessingPage() {
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
          Processamento de Documentos
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Extraia texto de documentos usando OCR e processamento avançado
        </p>
      </motion.div>
      
      {/* Cards de estatísticas */}
      <ProcessingStats />
      
      {/* Upload de documentos */}
      <FileUploadZone />
      
      {/* Histórico de processamento */}
      <ProcessingHistory />
    </motion.div>
  )
}