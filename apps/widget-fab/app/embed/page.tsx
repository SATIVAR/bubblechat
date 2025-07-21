"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import BubbleChatWidget from '../components/BubbleChatWidget'

function EmbedContent() {
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

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <BubbleChatWidget config={config} />
      </div>
    </div>
  )
}

export default function EmbedPage() {
  return (
    <Suspense fallback={null}>
      <EmbedContent />
    </Suspense>
  )
}