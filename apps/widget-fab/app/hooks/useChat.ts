"use client"

import { useState, useEffect, useCallback } from "react"
import { io, Socket } from "socket.io-client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: FileAttachment[]
  feedback?: 'positive' | 'negative'
}

interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

interface AgentInfo {
  name: string
  avatar?: string
  description?: string
  capabilities?: string[]
}

interface UseChatReturn {
  messages: Message[]
  isTyping: boolean
  isConnected: boolean
  agentInfo?: AgentInfo
  sendMessage: (content: string, attachments?: File[]) => void
  uploadFile: (file: File) => Promise<FileAttachment>
  sendFeedback: (messageId: string, feedback: 'positive' | 'negative') => void
}

export function useChat(clientId: string, agentId: string): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [agentInfo, setAgentInfo] = useState<AgentInfo>()
  const [socket, setSocket] = useState<Socket | null>(null)

  // Initialize socket connection
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const newSocket = io(apiUrl, {
      query: {
        clientId,
        agentId,
        type: 'widget'
      }
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to chat server')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from chat server')
    })

    newSocket.on('agent_info', (info: AgentInfo) => {
      setAgentInfo(info)
    })

    newSocket.on('message_history', (history: Message[]) => {
      setMessages(history)
    })

    newSocket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message])
      setIsTyping(false)
    })

    newSocket.on('typing_start', () => {
      setIsTyping(true)
    })

    newSocket.on('typing_stop', () => {
      setIsTyping(false)
    })

    newSocket.on('error', (error: any) => {
      console.error('Chat error:', error)
      setIsTyping(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [clientId, agentId])

  // Send message
  const sendMessage = useCallback((content: string, attachments?: File[]) => {
    if (!socket || !isConnected) return

    const message: Omit<Message, 'id'> = {
      role: 'user',
      content,
      timestamp: new Date(),
      attachments: attachments?.map(file => ({
        id: Math.random().toString(36),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }))
    }

    // Add user message immediately
    const userMessage: Message = {
      ...message,
      id: Math.random().toString(36)
    }
    setMessages(prev => [...prev, userMessage])

    // Send to server
    socket.emit('send_message', {
      content,
      attachments: attachments?.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        data: file // This would be handled differently in production
      }))
    })

    setIsTyping(true)
  }, [socket, isConnected])

  // Upload file
  const uploadFile = useCallback(async (file: File): Promise<FileAttachment> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('clientId', clientId)
    formData.append('agentId', agentId)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      return result.file
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }, [clientId, agentId])

  // Send feedback
  const sendFeedback = useCallback((messageId: string, feedback: 'positive' | 'negative') => {
    if (!socket || !isConnected) return

    socket.emit('message_feedback', {
      messageId,
      feedback
    })

    // Update local message
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback }
        : msg
    ))
  }, [socket, isConnected])

  return {
    messages,
    isTyping,
    isConnected,
    agentInfo,
    sendMessage,
    uploadFile,
    sendFeedback
  }
}