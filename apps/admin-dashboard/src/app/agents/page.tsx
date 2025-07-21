'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { AgentConfig, Client } from '@/types'

// Modal para configurar agente
function AgentModal({ 
  isOpen, 
  onClose, 
  agent, 
  clients,
  onSave 
}: { 
  isOpen: boolean
  onClose: () => void
  agent?: AgentConfig
  clients: Client[]
  onSave: (agent: Omit<AgentConfig, 'id' | 'createdAt' | 'updatedAt'>) => void
}) {
  const [formData, setFormData] = useState({
    clientId: agent?.clientId || '',
    name: agent?.name || '',
    description: agent?.description || '',
    systemPrompt: agent?.systemPrompt || 'Você é um assistente IA especializado em atendimento ao cliente. Seja prestativo, profissional e sempre responda em português brasileiro.',
    llmProvider: agent?.llmProvider || 'openai' as const,
    model: agent?.model || 'gpt-4',
    temperature: agent?.temperature || 0.7,
    maxTokens: agent?.maxTokens || 1500,
    isActive: agent?.isActive ?? true
  })

  const llmModels = {
    openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    gemini: ['gemini-pro', 'gemini-pro-vision'],
    agno: ['agno-1', 'agno-2']
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      contextDocuments: agent?.contextDocuments || []
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {agent ? 'Editar Agente IA' : 'Novo Agente IA'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.company}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Agente
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Assistente Comercial"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Especializado em vendas e orçamentos"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt do Sistema
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Defina como o agente deve se comportar..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Este prompt define a personalidade e comportamento do agente IA
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provedor LLM
              </label>
              <select
                value={formData.llmProvider}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  llmProvider: e.target.value as AgentConfig['llmProvider'],
                  model: llmModels[e.target.value as keyof typeof llmModels][0]
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="openai">OpenAI</option>
                <option value="gemini">Google Gemini</option>
                <option value="agno">Agno</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {llmModels[formData.llmProvider].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperatura ({formData.temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Conservador</span>
                <span>Criativo</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de Tokens
              </label>
              <input
                type="number"
                value={formData.maxTokens}
                onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="100"
                max="4000"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Agente ativo
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {agent ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const { state, dispatch } = useApp()
  const { agents, clients, loading } = state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<AgentConfig | undefined>()
  const [selectedClientId, setSelectedClientId] = useState<string>('')

  // Verificar se há um cliente específico na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const clientId = urlParams.get('client')
    if (clientId) {
      setSelectedClientId(clientId)
    }
  }, [])

  const handleSaveAgent = (agentData: Omit<AgentConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAgent) {
      // Atualizar agente existente
      const updatedAgent: AgentConfig = {
        ...editingAgent,
        ...agentData,
        updatedAt: new Date()
      }
      dispatch({ type: 'UPDATE_AGENT', payload: updatedAgent })
    } else {
      // Criar novo agente
      const newAgent: AgentConfig = {
        id: Date.now().toString(),
        ...agentData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      dispatch({ type: 'ADD_AGENT', payload: newAgent })
    }
    setEditingAgent(undefined)
  }

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client ? `${client.name} - ${client.company}` : 'Cliente não encontrado'
  }

  const getProviderBadge = (provider: AgentConfig['llmProvider']) => {
    const styles = {
      openai: 'bg-green-100 text-green-800',
      gemini: 'bg-blue-100 text-blue-800',
      agno: 'bg-purple-100 text-purple-800'
    }
    
    const labels = {
      openai: 'OpenAI',
      gemini: 'Gemini',
      agno: 'Agno'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[provider]}`}>
        {labels[provider]}
      </span>
    )
  }

  const filteredAgents = selectedClientId 
    ? agents.filter(agent => agent.clientId === selectedClientId)
    : agents

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando agentes...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agentes IA</h1>
          <p className="text-gray-600 mt-2">
            Configure agentes IA personalizados para cada cliente
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="mr-2">🤖</span>
          Novo Agente
        </button>
      </div>

      {/* Filtro por cliente */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por cliente
        </label>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os clientes</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.company}
            </option>
          ))}
        </select>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedClientId ? 'Nenhum agente configurado para este cliente' : 'Nenhum agente configurado'}
          </h3>
          <p className="text-gray-500 mb-6">
            Configure agentes IA personalizados para atender seus clientes de forma automatizada.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <span className="mr-2">🤖</span>
            Criar Agente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{agent.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {agent.isActive ? (
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  ) : (
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cliente:</span>
                  <span className="text-gray-900">{getClientName(agent.clientId)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Provedor:</span>
                  {getProviderBadge(agent.llmProvider)}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Modelo:</span>
                  <span className="text-gray-900">{agent.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Temperatura:</span>
                  <span className="text-gray-900">{agent.temperature}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Prompt do Sistema:</p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {agent.systemPrompt}
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-xs text-gray-500">
                  Criado em {agent.createdAt.toLocaleDateString('pt-BR')}
                </span>
                <button
                  onClick={() => {
                    setEditingAgent(agent)
                    setIsModalOpen(true)
                  }}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AgentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAgent(undefined)
        }}
        agent={editingAgent}
        clients={clients}
        onSave={handleSaveAgent}
      />
    </div>
  )
}