import axios from 'axios'
import { LLMProvider, BudgetResponse, LLMConfig } from '../types'

export class AgnoProvider implements LLMProvider {
  name = 'Agno'
  private apiKey: string
  private baseURL: string

  constructor(config: LLMConfig & { baseURL?: string }) {
    this.apiKey = config.apiKey
    this.baseURL = config.baseURL || 'https://api.agno.ai/v1' // URL exemplo
  }

  async generateBudget(prompt: string, documentText: string): Promise<BudgetResponse> {
    const systemPrompt = `Você é um especialista em orçamentos e análise de projetos. 
    Baseado no texto extraído de documentos, você deve gerar um orçamento detalhado e realista.
    
    Responda SEMPRE em formato JSON válido com a seguinte estrutura:
    {
      "title": "Título do projeto",
      "description": "Descrição resumida",
      "items": [
        {
          "description": "Descrição do item",
          "quantity": 1,
          "unitPrice": 1000,
          "totalPrice": 1000,
          "category": "Categoria"
        }
      ],
      "totalValue": 0,
      "estimatedTime": "X semanas/meses",
      "confidence": 85
    }`

    const userPrompt = `${prompt}\n\nTexto do documento:\n${documentText}`

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'agno-1',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const content = response.data.choices[0]?.message?.content
      if (!content) {
        throw new Error('Resposta vazia do Agno')
      }

      return JSON.parse(content) as BudgetResponse
    } catch (error) {
      console.error('Erro ao gerar orçamento com Agno:', error)
      throw new Error('Falha ao gerar orçamento')
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'agno-1',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('Erro ao gerar resposta com Agno:', error)
      throw new Error('Falha ao gerar resposta')
    }
  }
}