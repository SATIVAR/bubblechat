'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Client, AgentConfig, Document, Budget, SystemSettings, DashboardStats, RecentActivity } from '@/types'

interface AppState {
  clients: Client[]
  agents: AgentConfig[]
  documents: Document[]
  budgets: Budget[]
  settings: SystemSettings
  stats: DashboardStats
  recentActivity: RecentActivity[]
  loading: boolean
  error: string | null
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'SET_AGENTS'; payload: AgentConfig[] }
  | { type: 'ADD_AGENT'; payload: AgentConfig }
  | { type: 'UPDATE_AGENT'; payload: AgentConfig }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'SET_SETTINGS'; payload: SystemSettings }
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'SET_RECENT_ACTIVITY'; payload: RecentActivity[] }

const initialState: AppState = {
  clients: [],
  agents: [],
  documents: [],
  budgets: [],
  settings: {
    platformName: 'Bubblechat Platform',
    supportEmail: 'suporte@bubblechat.com',
    maxFileSize: 50,
    defaultOcrLanguage: 'por',
    autoCleanup: true,
    auditLogs: true,
    llmProviders: []
  },
  stats: {
    totalClients: 0,
    activeAgents: 0,
    documentsProcessed: 0,
    conversionRate: 0,
    budgetsGenerated: 0,
    totalBudgetValue: 0,
    approvalRate: 0,
    avgProcessingTime: '0min'
  },
  recentActivity: [],
  loading: false,
  error: null
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload }
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] }
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        )
      }
    case 'SET_AGENTS':
      return { ...state, agents: action.payload }
    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.payload] }
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id ? action.payload : agent
        )
      }
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload }
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] }
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload }
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] }
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload }
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'SET_RECENT_ACTIVITY':
      return { ...state, recentActivity: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Simular carregamento inicial de dados
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      try {
        // Dados mockados para demonstração
        const mockClients: Client[] = [
          {
            id: '1',
            name: 'João Silva',
            email: 'joao@empresa.com',
            company: 'Empresa ABC',
            status: 'active',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
          },
          {
            id: '2',
            name: 'Maria Santos',
            email: 'maria@tech.com',
            company: 'Tech Solutions',
            status: 'active',
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-20')
          }
        ]

        const mockAgents: AgentConfig[] = [
          {
            id: '1',
            clientId: '1',
            name: 'Assistente Comercial',
            description: 'Agente especializado em vendas e orçamentos',
            systemPrompt: 'Você é um assistente comercial especializado em gerar orçamentos baseados em documentos técnicos.',
            llmProvider: 'openai',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 1500,
            contextDocuments: [],
            isActive: true,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
          }
        ]

        const mockStats: DashboardStats = {
          totalClients: mockClients.length,
          activeAgents: mockAgents.filter(a => a.isActive).length,
          documentsProcessed: 247,
          conversionRate: 87,
          budgetsGenerated: 156,
          totalBudgetValue: 2400000,
          approvalRate: 73,
          avgProcessingTime: '3.2min'
        }

        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'document_processed',
            title: 'Documento processado',
            description: 'PDF de especificações técnicas processado com sucesso',
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            clientId: '1'
          },
          {
            id: '2',
            type: 'budget_generated',
            title: 'Orçamento gerado',
            description: 'Orçamento automático criado para Cliente ABC',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            clientId: '1'
          },
          {
            id: '3',
            type: 'client_added',
            title: 'Novo cliente cadastrado',
            description: 'Tech Solutions foi adicionada ao sistema',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            clientId: '2'
          }
        ]

        dispatch({ type: 'SET_CLIENTS', payload: mockClients })
        dispatch({ type: 'SET_AGENTS', payload: mockAgents })
        dispatch({ type: 'SET_STATS', payload: mockStats })
        dispatch({ type: 'SET_RECENT_ACTIVITY', payload: mockActivity })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar dados iniciais' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadInitialData()
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider')
  }
  return context
}