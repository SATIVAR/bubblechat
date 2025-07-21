import { useState, useEffect } from 'react';
import { settingsService } from '@/services/settingsService';
import { SystemSettings, LLMProvider } from '@/types';

interface UseSettingsReturn {
  settings: (SystemSettings & { llmProviders: LLMProvider[] }) | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<SystemSettings> & { llmProviders?: LLMProvider[] }) => Promise<boolean>;
  addLLMProvider: (provider: Omit<LLMProvider, 'id'>) => Promise<boolean>;
  updateLLMProvider: (id: string, provider: Partial<LLMProvider>) => Promise<boolean>;
  deleteLLMProvider: (id: string) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<(SystemSettings & { llmProviders: LLMProvider[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await settingsService.getSettings();
      
      if (response.success && response.data) {
        setSettings(response.data);
      } else {
        setError(response.message || 'Erro ao carregar configurações');
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SystemSettings> & { llmProviders?: LLMProvider[] }): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await settingsService.updateSettings(newSettings);
      
      if (response.success && response.data) {
        setSettings(response.data);
        return true;
      } else {
        setError(response.message || 'Erro ao atualizar configurações');
        return false;
      }
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      setError('Erro ao atualizar configurações');
      return false;
    }
  };

  const addLLMProvider = async (provider: Omit<LLMProvider, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await settingsService.addLLMProvider(provider);
      
      if (response.success) {
        // Recarregar configurações para obter a lista atualizada
        await loadSettings();
        return true;
      } else {
        setError(response.message || 'Erro ao adicionar provedor LLM');
        return false;
      }
    } catch (err) {
      console.error('Erro ao adicionar provedor LLM:', err);
      setError('Erro ao adicionar provedor LLM');
      return false;
    }
  };

  const updateLLMProvider = async (id: string, provider: Partial<LLMProvider>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await settingsService.updateLLMProvider(id, provider);
      
      if (response.success) {
        // Recarregar configurações para obter a lista atualizada
        await loadSettings();
        return true;
      } else {
        setError(response.message || 'Erro ao atualizar provedor LLM');
        return false;
      }
    } catch (err) {
      console.error('Erro ao atualizar provedor LLM:', err);
      setError('Erro ao atualizar provedor LLM');
      return false;
    }
  };

  const deleteLLMProvider = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await settingsService.deleteLLMProvider(id);
      
      if (response.success) {
        // Recarregar configurações para obter a lista atualizada
        await loadSettings();
        return true;
      } else {
        setError(response.message || 'Erro ao remover provedor LLM');
        return false;
      }
    } catch (err) {
      console.error('Erro ao remover provedor LLM:', err);
      setError('Erro ao remover provedor LLM');
      return false;
    }
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    addLLMProvider,
    updateLLMProvider,
    deleteLLMProvider,
    refreshSettings,
  };
}