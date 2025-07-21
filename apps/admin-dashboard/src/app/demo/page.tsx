"use client";

import { motion } from "framer-motion";
import { StatsGrid } from "@/components/ui/stats-card";
import { 
  Users, 
  Bot, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target, 
  Zap,
  ArrowUpRight,
  Activity,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  const statsData = [
    { 
      title: 'Total de Clientes', 
      value: '2,847', 
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'novos este mês'
    },
    { 
      title: 'Agentes Ativos', 
      value: '24', 
      change: '+5%',
      changeType: 'positive' as const,
      icon: Bot,
      description: 'em operação'
    },
    { 
      title: 'Documentos Processados', 
      value: '12,543', 
      change: '+23%',
      changeType: 'positive' as const,
      icon: FileText,
      description: 'esta semana'
    },
    { 
      title: 'Taxa de Conversão', 
      value: '87.3%', 
      change: '+3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'vs. mês anterior'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Novo documento processado",
      description: "PDF de especificações técnicas analisado com sucesso",
      time: "2 min atrás",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      id: 2,
      title: "Orçamento gerado",
      description: "Proposta de R$ 45.000 criada para Cliente ABC",
      time: "5 min atrás",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      id: 3,
      title: "Novo cliente cadastrado",
      description: "Empresa XYZ adicionada ao sistema",
      time: "15 min atrás",
      icon: Users,
      color: "text-purple-600"
    },
    {
      id: 4,
      title: "Agente IA configurado",
      description: "Bot de atendimento personalizado ativado",
      time: "1h atrás",
      icon: Bot,
      color: "text-orange-600"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header Premium */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
          Dashboard Premium
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experiência moderna e intuitiva para gerenciamento de clientes e agentes IA
        </p>
        <div className="flex justify-center mt-6">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <Activity className="mr-2 h-5 w-5" />
            Ver Métricas Avançadas
          </Button>
        </div>
      </motion.div>
      
      {/* Cards de estatísticas com animação */}
      <StatsGrid stats={statsData} />
      
      {/* Grid de conteúdo avançado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Atividade Recente */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardTitle className="flex items-center text-xl">
                <Activity className="mr-2 h-5 w-5 text-blue-600" />
                Atividade em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity, index) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border border-blue-100">
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Métricas de Performance */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-900">
                <Target className="mr-2 h-5 w-5" />
                Performance IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 mb-2">98.5%</div>
              <p className="text-blue-700 text-sm">Precisão dos agentes</p>
              <div className="mt-4 bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-900">
                <Zap className="mr-2 h-5 w-5" />
                Tempo Resposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 mb-2">1.2s</div>
              <p className="text-purple-700 text-sm">Média de processamento</p>
              <div className="mt-4 flex items-center text-xs text-purple-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                -15% vs. mês anterior
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-green-900">
                <BarChart3 className="mr-2 h-5 w-5" />
                Satisfação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 mb-2">4.8/5</div>
              <p className="text-green-700 text-sm">Avaliação dos clientes</p>
              <div className="mt-4 flex space-x-1">
                {[1,2,3,4,5].map((star) => (
                  <div key={star} className={`w-4 h-4 rounded-full ${star <= 4 ? 'bg-green-500' : 'bg-green-300'}`}></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Seção de Recursos Premium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Recursos Premium Ativados</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Aproveite todas as funcionalidades avançadas do Bubblechat Admin para maximizar sua produtividade
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Bot className="h-8 w-8 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">IA Avançada</h3>
              <p className="text-sm text-blue-100">Processamento inteligente de documentos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Zap className="h-8 w-8 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Performance</h3>
              <p className="text-sm text-blue-100">Resposta em tempo real</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Target className="h-8 w-8 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Precisão</h3>
              <p className="text-sm text-blue-100">98.5% de acurácia</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}