'use client'

import { useState } from 'react'
import { useDocuments } from '@/hooks/useDocuments'
import { useClients } from '@/hooks/useClients'
import { motion } from 'framer-motion'
import { 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  FileImage,
  FilePdf,
  FileSpreadsheet,
  File
} from 'lucide-react'

export default function FileUploadZone() {
  const { clients } = useClients({ autoFetch: true })
  const { uploadDocument } = useDocuments()
  const [selectedClient, setSelectedClient] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Selecione um arquivo para upload')
      return
    }
    
    if (!selectedClient) {
      setError('Selecione um cliente')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess(false)
    
    try {
      await uploadDocument(file, selectedClient)
      setSuccess(true)
      setFile(null)
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Upload className="h-5 w-5 mr-2 text-blue-600" />
          Upload de Documento
        </h3>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleUpload} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">Documento enviado com sucesso!</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ? `(${client.company})` : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/tiff,image/bmp,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              />
              
              {file ? (
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    {file.type.includes('image') ? (
                      <FileImage className="h-5 w-5 text-blue-600" />
                    ) : file.type.includes('pdf') ? (
                      <FilePdf className="h-5 w-5 text-red-600" />
                    ) : file.type.includes('sheet') || file.type.includes('excel') || file.type.includes('csv') ? (
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    ) : (
                      <File className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2">Arraste e solte um arquivo ou</p>
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                  >
                    Selecionar arquivo
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos suportados: JPG, PNG, TIFF, BMP, PDF, XLSX, XLS, CSV
                  </p>
                  <p className="text-xs text-gray-500">
                    Tamanho máximo: 50MB
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !file || !selectedClient}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Fazer Upload
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}