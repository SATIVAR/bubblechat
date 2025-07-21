import { OpenAIProvider } from './providers/openai'
import { GeminiProvider } from './providers/gemini'
import { AgnoProvider } from './providers/agno'
import { LLMProvider, BudgetResponse, BudgetGenerationOptions, LLMConfig } from './types'

export class BudgetGenerator {
  private providers: Map<string, LLMProvider> = new Map()

  constructor() {
    // Providers serão configurados dinamicamente
  }

  configureProvider(name: 'openai' | 'gemini' | 'agno', config: LLMConfig & { baseURL?: string }) {
    switch (name) {
      case 'openai':
        this.providers.set('openai', new OpenAIProvider(config))
        break
      case 'gemini':
        this.providers.set('gemini', new GeminiProvider(config))
        break
      case 'agno':
        this.providers.set('agno', new AgnoProvider(config))
        break
    }
  }

  async generateBudget(
    documentText: string,
    options: BudgetGenerationOptions
  ): Promise<BudgetResponse> {
    const provider = this.providers.get(options.provider)
    if (!provider) {
      throw new Error(`Provider ${options.provider} não configurado`)
    }

    const prompt = this.buildPrompt(options)
    return await provider.generateBudget(prompt, documentText)
  }

  private buildPrompt(options: BudgetGenerationOptions): string {
    let prompt = 'Gere um orçamento detalhado baseado no documento fornecido.'

    if (options.template) {
      prompt += `\n\nUse o seguinte template como base:\n${options.template}`
    }

    if (options.includeDetails) {
      prompt += '\n\nIncluir detalhes técnicos e justificativas para cada item.'
    }

    if (options.currency) {
      prompt += `\n\nUsar moeda: ${options.currency}`
    }

    prompt += '\n\nConsidere:'
    prompt += '\n- Preços realistas para o mercado brasileiro'
    prompt += '\n- Margem de lucro adequada'
    prompt += '\n- Complexidade técnica do projeto'
    prompt += '\n- Tempo estimado de execução'
    prompt += '\n- Recursos necessários'

    return prompt
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  isProviderConfigured(provider: string): boolean {
    return this.providers.has(provider)
  }
}