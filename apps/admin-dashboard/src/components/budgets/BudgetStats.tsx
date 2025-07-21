'use client'

import { Calculator, DollarSign, TrendingUp, Clock } from 'lucide-react'

const stats = [
  {
    name: 'Orçamentos Gerados',
    value: '156',
    change: '+18%',
    changeType: 'increase',
    icon: Calculator,
    color: 'blue'
  },
  {
    name: 'Valor Total',
    value: 'R$ 2.4M',
    change: '+25%',
    changeType: 'increase',
    icon: DollarSign,
    color: 'green'
  },
  {
    name: 'Taxa de Aprovação',
    value: '73%',
    change: '+5%',
    changeType: 'increase',
    icon: TrendingUp,
    color: 'purple'
  },
  {
    name: 'Tempo Médio',
    value: '3.2min',
    change: '-12%',
    changeType: 'decrease',
    icon: Clock,
    color: 'orange'
  }
]

export function BudgetStats() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-600" />
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
  )
}