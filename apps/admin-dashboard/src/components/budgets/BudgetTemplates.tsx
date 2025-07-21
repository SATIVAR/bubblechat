'use client'

import { useState } from 'react'
import { FileText, Plus, Edit, Trash2, Copy, Star } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  isDefault: boolean
  usageCount: number
  lastUsed: string
  sections: string[]
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Desenvolvimento de Software',
    description: 'Template padrão para projetos de desenvolvimento de software',
    category: 'Tecnologia',
    isDefault: true,
    usageCount: 45,
    lastUsed: '2024-01-15T10:30:00Z',
    sections: ['Análise', 'Desenvolvimento', 'Testes', 'Deploy', 'Suporte']
  },
  {
    id: '2',
    name: 'Consultoria Empresarial',
    description: 'Template para serviços de consultoria e análise empresarial',
    category: 'Consultoria',
    isDefault: false,
    usageCount: 23,
    lastUsed: '2024-01-14T15:20:00Z',
    sections: ['Diagnóstico', 'Planejamento', 'Implementação', 'Acompanhamento']
  },
  {
    id: '3',
    name: 'Infraestrutura de TI',
    description: 'Template para projetos de infraestrutura e redes',
    category: 'Infraestrutura',
    isDefault: false,
    usageCount: 18,
    lastUsed: '2024-01-13T09:45:00Z',
    sections: ['Análise Atual', 'Projeto', 'Implementação', 'Migração', 'Suporte']
  }
]

export function BudgetTemplates() {
  const [templates] = useState<Template[]>(mockTemplates)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'Tecnologia', 'Consultoria', 'Infraestrutura']

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas as categorias</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </button>
      </div>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  {template.isDefault && (
                    <div className="ml-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-yellow-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  {!template.isDefault && (
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {template.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {template.description}
                </p>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {template.category}
                  </span>
                  <span>{template.usageCount} usos</span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Último uso: {formatDate(template.lastUsed)}
                </p>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Seções:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.sections.map((section, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Usar Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum template encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou criar um novo template.
          </p>
        </div>
      )}
    </div>
  )
}