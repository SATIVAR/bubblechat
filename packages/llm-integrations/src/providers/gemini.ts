import { GoogleGenerativeAI } from '@google/generative-ai'
import { LLMProvider, BudgetResponse, LLMConfig } from '../types'

export class GeminiProvider implements LLMProvider {
  name = 'Gemini'
  private client: GoogleGenerativeAI

  constructor(config: LLMConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey)
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

    const fullPrompt = `${systemPrompt}\n\n${prompt}\n\nTexto do documento:\n${documentText}`

    try {
      const model = this.client.getGenerativeModel({ model: 'gemini-pro' })
      const result = await model.generateContent(fullPrompt)
      const response = result.response.text()

      if (!response) {
        throw new Error('Resposta vazia do Gemini')
      }

      // Limpar possíveis caracteres extras do JSON
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim()
      return JSON.parse(cleanResponse) as BudgetResponse
    } catch (error) {
      console.error('Erro ao gerar orçamento com Gemini:', error)
      throw new Error('Falha ao gerar orçamento')
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({ model: 'gemini-pro' })
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      console.error('Erro ao gerar resposta com Gemini:', error)
      throw new Error('Falha ao gerar resposta')
    }
  }
}