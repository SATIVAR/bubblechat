'use client'

import React, { useState } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { LLMProvider } from '@/types'

export default function SettingsPage() {
  const {
    settings,
    isLoading,
    error,
    updateSettings,
    addLLMProvider,
    updateLLMProvider,
    deleteLLMProvider,
  } = useSettings()

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [formData, setFormData] = useState(settings)

  // Atualizar formData quando settings mudar
  React.useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSaving(true)
    
    try {
      const success = await updateSettings(formData)
      
      if (success) {
        setSaveMessage('Configurações salvas com sucesso!')
      } else {
        setSaveMessage('Erro ao salvar configurações')
      }
      
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      setSaveMessage('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddLLMProvider = () => {
    if (!formData) return

    const newProvider: LLMProvider = {
      id: `temp-${Date.now()}`,
      name: '',
      apiKey: '',
      baseUrl: '',
      models: [],
      isActive: true
    }
    
    setFormData({
      ...formData,
      llmProviders: [...formData.llmProviders, newProvider]
    })
  }

  const handleUpdateLLMProvider = (index: number, field: string, value: any) => {
    if (!formData) return

    const updatedProviders = [...formData.llmProviders]
    updatedProviders[index] = { ...updatedProviders[index], [field]: value }
    
    setFormData({
      ...formData,
      llmProviders: updatedProviders
    })
  }

  const handleRemoveLLMProvider = async (index: number) => {
    if (!formData) return

    const provider = formData.llmProviders[index]
    
    // Se o provedor tem um ID real (não temporário), remover do banco
    if (provider.id && !provider.id.startsWith('temp-')) {
      const success = await deleteLLMProvider(provider.id)
      if (!success) {
        setSaveMessage('Erro ao remover provedor LLM')
        return
      }
    }
    
    // Remover da lista local
    const updatedProviders = formData.llmProviders.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      llmProviders: updatedProviders
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <h3 className="font-medium">Erro ao carregar configurações</h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-8 text-gray-500">
          Nenhuma configuração encontrada.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">
          Configure as definições gerais da plataforma e integrações
        </p>
      </div>

      {saveMessage && (
        <div className={`mb-6 p-4 rounded-md ${
          saveMessage.includes('sucesso') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {saveMessage}
        </div>
      )}
      
      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configurações Gerais */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Plataforma
                </label>
                <input
                  type="text"
                  value={formData.platformName}
                  onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Suporte
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Processamento de Documentos */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Processamento de Documentos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho Máximo de Arquivo (MB)
                </label>
                <input
                  type="number"
                  value={formData.maxFileSize}
                  onChange={(e) => setFormData({ ...formData, maxFileSize: parseInt(e.target.value) })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma OCR Padrão
                </label>
                <select 
                  value={formData.defaultOcrLanguage}
                  onChange={(e) => setFormData({ ...formData, defaultOcrLanguage: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="por">Português</option>
                  <option value="eng">Inglês</option>
                  <option value="spa">Espanhol</option>
                </select>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Segurança</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-cleanup"
                  checked={formData.autoCleanup}
                  onChange={(e) => setFormData({ ...formData, autoCleanup: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="auto-cleanup" className="ml-2 block text-sm text-gray-900">
                  Limpeza automática de arquivos temporários
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="audit-logs"
                  checked={formData.auditLogs}
                  onChange={(e) => setFormData({ ...formData, auditLogs: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="audit-logs" className="ml-2 block text-sm text-gray-900">
                  Habilitar logs de auditoria
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Provedores LLM */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Provedores LLM</h3>
            <button
              type="button"
              onClick={handleAddLLMProvider}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
            >
              + Adicionar Provedor
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.llmProviders.map((provider, index) => (
              <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">Provedor {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveLLMProvider(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remover
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={provider.name}
                      onChange={(e) => handleUpdateLLMProvider(index, 'name', e.target.value)}
                      placeholder="Ex: OpenAI"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={provider.apiKey}
                      onChange={(e) => handleUpdateLLMProvider(index, 'apiKey', e.target.value)}
                      placeholder="Sua chave de API"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base URL (opcional)
                    </label>
                    <input
                      type="url"
                      value={provider.baseUrl || ''}
                      onChange={(e) => handleUpdateLLMProvider(index, 'baseUrl', e.target.value)}
                      placeholder="https://api.openai.com/v1"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`provider-active-${index}`}
                      checked={provider.isActive}
                      onChange={(e) => handleUpdateLLMProvider(index, 'isActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`provider-active-${index}`} className="ml-2 block text-sm text-gray-900">
                      Provedor ativo
                    </label>
                  </div>
                </div>
              </div>
            ))}
            
            {formData.llmProviders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum provedor LLM configurado. Adicione um provedor para começar.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  )
}