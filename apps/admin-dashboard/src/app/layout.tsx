import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/contexts/AppContext'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bubblechat Admin Dashboard',
  description: 'Painel administrativo premium para gerenciamento de clientes e agentes IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <AppProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </AppProvider>
      </body>
    </html>
  )
}