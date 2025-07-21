"use client";

import { motion } from "framer-motion";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Bot, 
  FileText, 
  TrendingUp, 
  Sparkles, 
  Zap,
  Target,
  ArrowRight
} from "lucide-react";

export default function TestPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Premium */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          🎉 Novo Design Premium Ativado!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transformação completa do admin dashboard com componentes modernos da Aceternity UI
        </p>
      </motion.div>
      
      {/* Demonstração dos novos componentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Clientes"
          value="2,847"
          change="+12%"
          changeType="positive"
          icon={Users}
          description="novos este mês"
        />
        <StatsCard
          title="Agentes Ativos"
          value="24"
          change="+5%"
          changeType="positive"
          icon={Bot}
          description="em operação"
        />
        <StatsCard
          title="Documentos"
          value="12,543"
          change="+23%"
          changeType="positive"
          icon={FileText}
          description="processados"
        />
        <StatsCard
          title="Performance"
          value="98.5%"
          change="+3%"
          changeType="positive"
          icon={TrendingUp}
          description="de precisão"
        />
      </div>
      
      {/* Cards de recursos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Sparkles className="mr-2 h-5 w-5" />
                Design Moderno
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-sm mb-4">
                Interface premium com animações suaves e componentes responsivos
              </p>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                Ver Detalhes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-900">
                <Zap className="mr-2 h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 text-sm mb-4">
                Carregamento rápido e interações fluidas com Framer Motion
              </p>
              <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                Testar Velocidade
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-green-900">
                <Target className="mr-2 h-5 w-5" />
                Funcionalidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-sm mb-4">
                Sidebar responsiva, cards animados e layout premium
              </p>
              <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                Explorar Tudo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Seção de sucesso */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">✅ Transformação Concluída!</h2>
          <p className="text-green-100 mb-6">
            O admin dashboard agora possui um design premium com componentes modernos, 
            animações suaves e uma experiência de usuário excepcional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Ver Dashboard Principal
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Explorar Componentes
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Lista de melhorias */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🚀 Melhorias Implementadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sidebar Moderna</h4>
                <p className="text-gray-600 text-sm">Com animações e collapse responsivo</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Cards de Estatísticas</h4>
                <p className="text-gray-600 text-sm">Com gradientes e métricas visuais</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Animações Suaves</h4>
                <p className="text-gray-600 text-sm">Powered by Framer Motion</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Design Responsivo</h4>
                <p className="text-gray-600 text-sm">Funciona perfeitamente em todos os dispositivos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Componentes Premium</h4>
                <p className="text-gray-600 text-sm">Baseados na biblioteca Aceternity UI</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Tema Consistente</h4>
                <p className="text-gray-600 text-sm">Sistema de design unificado</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}