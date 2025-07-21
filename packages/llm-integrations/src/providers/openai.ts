import OpenAI from 'openai'
import { LLMProvider, BudgetResponse, LLMConfig } from '../types'

export class OpenAIProvider implements LLMProvider {
  name = 'OpenAI'
  private client: OpenAI

  constructor(config: LLMConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
    })
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
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('Resposta vazia do OpenAI')
      }

      return JSON.parse(response) as BudgetResponse
    } catch (error) {
      console.error('Erro ao gerar orçamento com OpenAI:', error)
      throw new Error('Falha ao gerar orçamento')
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      return completion.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('Erro ao gerar resposta com OpenAI:', error)
      throw new Error('Falha ao gerar resposta')
    }
  }
}