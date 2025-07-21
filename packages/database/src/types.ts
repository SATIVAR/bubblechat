// Tipos básicos do banco de dados
export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'CLIENT' | 'AGENT'
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Agent {
  id: string
  name: string
  description: string
  model: string
  isActive: boolean
  clientId: string
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  size: number
  status: 'PROCESSING' | 'COMPLETED' | 'ERROR'
  extractedText?: string
  confidence?: number
  processingTime?: number
  clientId: string
  createdAt: Date
  updatedAt: Date
}

export interface Budget {
  id: string
  title: string
  description?: string
  value: number
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED'
  items: BudgetItem[]
  documentId?: string
  clientId: string
  createdAt: Date
  updatedAt: Date
}

export interface BudgetItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  budgetId: string
}