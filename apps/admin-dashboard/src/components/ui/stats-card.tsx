"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  description 
}: StatsCardProps) {
  const isPositive = changeType === "positive";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-60" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 text-emerald-600" />
            ) : (
              <ArrowDownLeft className="h-3 w-3 text-red-600" />
            )}
            <span className={cn(
              "text-xs font-medium",
              isPositive ? "text-emerald-600" : "text-red-600"
            )}>
              {change}
            </span>
            <span className="text-xs text-gray-500">
              {description || "from last month"}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: StatsCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}