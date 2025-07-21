'use client'

import { useState } from 'react'
import { Calculator, FileText, TrendingUp, Users, Plus, Filter } from 'lucide-react'
import { BudgetList } from './BudgetList'
import { BudgetStats } from './BudgetStats'
import { BudgetTemplates } from './BudgetTemplates'

const tabs = [
  { id: 'list', name: 'Orçamentos', icon: Calculator },
  { id: 'templates', name: 'Templates', icon: FileText },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp },
]

export function BudgetDashboard() {
  const [activeTab, setActiveTab] = useState('list')

  return (
    <div className="space-y-6">
      <BudgetStats />
      
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
            
            {activeTab === 'list' && (
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Orçamento
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'list' && <BudgetList />}
          {activeTab === 'templates' && <BudgetTemplates />}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics em Desenvolvimento</h3>
              <p className="mt-1 text-sm text-gray-500">
                Métricas detalhadas de orçamentos em breve.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}