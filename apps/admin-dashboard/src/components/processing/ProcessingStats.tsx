'use client'

import { FileText, Image, FileSpreadsheet, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

const stats = [
  {
    name: 'Documentos Processados Hoje',
    value: '47',
    change: '+12%',
    changeType: 'increase',
    icon: FileText,
    color: 'blue'
  },
  {
    name: 'OCR Realizados',
    value: '23',
    change: '+8%',
    changeType: 'increase',
    icon: Image,
    color: 'green'
  },
  {
    name: 'PDFs Analisados',
    value: '18',
    change: '+15%',
    changeType: 'increase',
    icon: FileText,
    color: 'purple'
  },
  {
    name: 'Planilhas Processadas',
    value: '6',
    change: '+3%',
    changeType: 'increase',
    icon: FileSpreadsheet,
    color: 'orange'
  }
]

const metrics = [
  {
    name: 'Taxa de Sucesso',
    value: '96.2%',
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100'
  },
  {
    name: 'Tempo Médio',
    value: '2.4s',
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    name: 'Confiança Média OCR',
    value: '94.1%',
    icon: TrendingUp,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    name: 'Erros Hoje',
    value: '2',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100'
  }
]

export function ProcessingStats() {
  return (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Métricas de Performance */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Métricas de Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${metric.bg}`}>
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}