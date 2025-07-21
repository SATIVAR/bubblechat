// Tipos principais do sistema
export interface Client {
  id: string
  name: string
  email: string
  company: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
  updatedAt: Date
  agentConfig?: AgentConfig
}

export interface AgentConfig {
  id: string
  clientId: string
  name: string
  description: string
  systemPrompt: string
  llmProvider: 'openai' | 'gemini' | 'agno'
  model: string
  temperature: number
  maxTokens: number
  contextDocuments: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  clientId: string
  filename: string
  originalName: string
  fileType: 'image' | 'pdf' | 'spreadsheet'
  mimeType: string
  size: number
  extractedText: string
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed'
  uploadedAt: Date
  processedAt?: Date
}

export interface Budget {
  id: string
  clientId: string
  documentId: string
  title: string
  description: string
  items: BudgetItem[]
  totalValue: number
  status: 'draft' | 'sent' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface BudgetItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface LLMProvider {
  id: string
  name: string
  apiKey: string
  baseUrl?: string
  models: string[]
  isActive: boolean
}

export interface SystemSettings {
  platformName: string
  supportEmail: string
  maxFileSize: number
  defaultOcrLanguage: string
  autoCleanup: boolean
  auditLogs: boolean
  llmProviders: LLMProvider[]
}

// Estados da aplicação
export interface DashboardStats {
  totalClients: number
  activeAgents: number
  documentsProcessed: number
  conversionRate: number
  budgetsGenerated: number
  totalBudgetValue: number
  approvalRate: number
  avgProcessingTime: string
}

export interface RecentActivity {
  id: string
  type: 'document_processed' | 'budget_generated' | 'client_added' | 'agent_configured'
  title: string
  description: string
  timestamp: Date
  clientId?: string
}