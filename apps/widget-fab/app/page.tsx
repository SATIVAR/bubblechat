"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import BubbleChatWidget from './components/BubbleChatWidget'

function WidgetContent() {
  const searchParams = useSearchParams()
  
  const config = {
    clientId: searchParams.get('client') || 'demo',
    agentId: searchParams.get('agent') || 'default',
    position: (searchParams.get('position') as any) || 'bottom-right',
    theme: (searchParams.get('theme') as any) || 'auto',
    primaryColor: searchParams.get('color') || undefined,
    title: searchParams.get('title') || undefined,
    subtitle: searchParams.get('subtitle') || undefined,
    avatar: searchParams.get('avatar') || undefined,
  }

  return <BubbleChatWidget config={config} />
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Suspense fallback={
        <div className="fixed bottom-6 right-6 w-14 h-14 bg-gray-300 rounded-full animate-pulse" />
      }>
        <WidgetContent />
      </Suspense>
    </div>
  )
}