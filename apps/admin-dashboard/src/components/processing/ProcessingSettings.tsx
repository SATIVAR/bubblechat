'use client'

import { useState } from 'react'
import { Save, RefreshCw, AlertTriangle } from 'lucide-react'

interface ProcessingConfig {
  ocr: {
    language: string
    confidence_threshold: number
    preprocessing: boolean
    timeout: number
  }
  pdf: {
    max_pages: number
    ocr_fallback: boolean
    preserve_formatting: boolean
  }
  spreadsheet: {
    max_rows: number
    include_headers: boolean
    sheet_limit: number
  }
  general: {
    max_file_size: number
    concurrent_processing: number
    auto_cleanup: boolean
    cleanup_days: number
  }
}

export function ProcessingSettings() {
  const [config, setConfig] = useState<ProcessingConfig>({
    ocr: {
      language: 'por',
      confidence_threshold: 80,
      preprocessing: true,
      timeout: 60
    },
    pdf: {
      max_pages: 100,
      ocr_fallback: true,
      preserve_formatting: true
    },
    spreadsheet: {
      max_rows: 10000,
      include_headers: true,
      sheet_limit: 10
    },
    general: {
      max_file_size: 50,
      concurrent_processing: 5,
      auto_cleanup: true,
      cleanup_days: 30
    }
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Aqui você faria a chamada real para a API
    console.log('Configurações salvas:', config)
  }

  const updateConfig = (section: keyof ProcessingConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-8">
      {/* OCR Settings */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de OCR</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma Principal
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={config.ocr.language}
              onChange={(e) => updateConfig('ocr', 'language', e.target.value)}
            >
              <option value="por">Português</option>
              <option value="eng">Inglês</option>
              <option value="spa">Espanhol</option>
              <option value="fra">Francês</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite de Confiança (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={config.ocr.confidence_threshold}
              onChange={(e) => updateConfig('ocr', 'confidence_threshold', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (segundos)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={config.ocr.timeout}
              onChange={(e) => updateConfig('ocr', 'timeout', parseInt(e.target.value))}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ocr-preprocessing"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={config.ocr.preprocessing}
              onChange={(e) => updateConfig('ocr', 'preprocessing', e.target.checked)}
            />
            <label htmlFor="ocr-preprocessing" className="ml-2 block text-sm text-gray-900">
              Pré-processamento de imagem
            </label>
          </div>
        </div>
      </div>

      {/* PDF Settings */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de PDF</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Páginas
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={config.pdf.max_pages}
              onChange={(e) => updateConfig('pdf', 'max_pages', parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pdf-ocr-fallback"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={config.pdf.ocr_fallback}
                onChange={(e) => updateConfig('pdf', 'ocr_fallback', e.target.checked)}
              />
              <label htmlFor="pdf-ocr-fallback" className="ml-2 block text-sm text-gray-900">
                OCR para PDFs escaneados
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pdf-preserve-formatting"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={config.pdf.preserve_formatting}
                onChange={(e) => updateConfig('pdf', 'preserve_formatting', e.target.checked)}
              />
              <label htmlFor="pdf-preserve-formatting" className="ml-2 block text-sm text-gray-900">
                Preservar formatação
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet Settings */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Planilhas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Linhas
            </label>
            <input
              type="number"
              min="100"
              max="100000"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={config.spreadsheet.max_rows}
              onChange={(e) => updateConfig('spreadsheet', 'max_rows', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite de Planilhas
            </label>
            <input
              type="number"
              min="1"
              max="50"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={config.spreadsheet.sheet_limit}
              onChange={(e) => updateConfig('spreadsheet', 'sheet_limit', parseInt(e.target.value))}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="spreadsheet-headers"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={config.spreadsheet.include_headers}
              onChange={(e) => updateConfig('spreadsheet', 'include_headers', e.target.checked)}
            />
            <label htmlFor="spreadsheet-headers" className="ml-2 block text-sm text-gray-900">
              Incluir cabeçalhos
            </label>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho Máximo de Arquivo (MB)
            </label>
            <input
              type="number"
              min="1"
              max="500"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={config.general.max_file_size}
              onChange={(e) => updateConfig('general', 'max_file_size', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processamento Simultâneo
            </label>
            <input
              type="number"
              min="1"
              max="20"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={config.general.concurrent_processing}
              onChange={(e) => updateConfig('general', 'concurrent_processing', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dias para Limpeza Automática
            </label>
            <input
              type="number"
              min="1"
              max="365"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={config.general.cleanup_days}
              onChange={(e) => updateConfig('general', 'cleanup_days', parseInt(e.target.value))}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-cleanup"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={config.general.auto_cleanup}
              onChange={(e) => updateConfig('general', 'auto_cleanup', e.target.checked)}
            />
            <label htmlFor="auto-cleanup" className="ml-2 block text-sm text-gray-900">
              Limpeza automática de arquivos
            </label>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Atenção
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Alterações nas configurações afetarão apenas novos processamentos. 
                Documentos já processados não serão reprocessados automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
    </div>
  )
}