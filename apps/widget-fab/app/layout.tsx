import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bubblle Chat Widget',
  description: 'AI-powered chat widget for customer support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="widget-container" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}