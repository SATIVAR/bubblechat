'use client'

import { useState } from 'react'
import { Upload, FileText, Image, FileSpreadsheet, Settings, Activity } from 'lucide-react'
import { FileUploadZone } from './FileUploadZone'
import { ProcessingStats } from './ProcessingStats'
import { ProcessingHistory } from './ProcessingHistory'
import { ProcessingSettings } from './ProcessingSettings'

const tabs = [
  { id: 'upload', name: 'Upload', icon: Upload },
  { id: 'history', name: 'Histórico', icon: Activity },
  { id: 'settings', name: 'Configurações', icon: Settings },
]

export function ProcessingDashboard() {
  const [activeTab, setActiveTab] = useState('upload')

  return (
    <div className="space-y-6">
      <ProcessingStats />
      
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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
        </div>

        <div className="p-6">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <FileUploadZone />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Image className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-900">OCR - Imagens</h3>
                      <p className="text-xs text-blue-700">JPG, PNG, TIFF, BMP</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-red-600" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-900">PDF</h3>
                      <p className="text-xs text-red-700">Documentos PDF</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-900">Planilhas</h3>
                      <p className="text-xs text-green-700">Excel, CSV</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && <ProcessingHistory />}
          {activeTab === 'settings' && <ProcessingSettings />}
        </div>
      </div>
    </div>
  )
}