export interface LLMProvider {
  name: string
  generateBudget(prompt: string, documentText: string): Promise<BudgetResponse>
  generateResponse(prompt: string): Promise<string>
}

export interface BudgetResponse {
  title: string
  description: string
  items: BudgetItem[]
  totalValue: number
  estimatedTime: string
  confidence: number
}

export interface BudgetItem {
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  category?: string
}

export interface LLMConfig {
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface BudgetGenerationOptions {
  provider: 'openai' | 'gemini' | 'agno'
  template?: string
  includeDetails?: boolean
  currency?: string
}