import { SystemSettings, LLMProvider } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface SettingsResponse {
  success: boolean;
  data?: SystemSettings & { llmProviders: LLMProvider[] };
  message?: string;
}

export interface LLMProviderResponse {
  success: boolean;
  data?: LLMProvider;
  message?: string;
}

class SettingsService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/api/settings${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getSettings(): Promise<SettingsResponse> {
    return this.request<SettingsResponse>('');
  }

  async updateSettings(settings: Partial<SystemSettings> & { llmProviders?: LLMProvider[] }): Promise<SettingsResponse> {
    return this.request<SettingsResponse>('', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async addLLMProvider(provider: Omit<LLMProvider, 'id' | 'createdAt' | 'updatedAt'>): Promise<LLMProviderResponse> {
    return this.request<LLMProviderResponse>('/llm-providers', {
      method: 'POST',
      body: JSON.stringify(provider),
    });
  }

  async updateLLMProvider(id: string, provider: Partial<LLMProvider>): Promise<LLMProviderResponse> {
    return this.request<LLMProviderResponse>(`/llm-providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(provider),
    });
  }

  async deleteLLMProvider(id: string): Promise<{ success: boolean; message?: string }> {
    return this.request<{ success: boolean; message?: string }>(`/llm-providers/${id}`, {
      method: 'DELETE',
    });
  }
}

export const settingsService = new SettingsService();