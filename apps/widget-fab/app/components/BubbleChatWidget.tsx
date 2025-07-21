"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Minus, Bot } from "lucide-react"
import { ChatInterface } from "./ChatInterface"
import { useChat } from "../hooks/useChat"

interface WidgetConfig {
  clientId: string
  agentId: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  title?: string
  subtitle?: string
  avatar?: string
}

interface BubbleChatWidgetProps {
  config: WidgetConfig
}

export default function BubbleChatWidget({ config }: BubbleChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [input, setInput] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  
  const {
    messages,
    isTyping,
    sendMessage,
    uploadFile,
    isConnected,
    agentInfo
  } = useChat(config.clientId, config.agentId)

  // Position classes
  const getPositionClasses = () => {
    switch (config.position || 'bottom-right') {
      case 'bottom-left':
        return 'bottom-6 left-6'
      case 'top-right':
        return 'top-6 right-6'
      case 'top-left':
        return 'top-6 left-6'
      default:
        return 'bottom-6 right-6'
    }
  }

  // Chat window position
  const getChatPosition = () => {
    switch (config.position || 'bottom-right') {
      case 'bottom-left':
        return 'bottom-20 left-0'
      case 'top-right':
        return 'top-20 right-0'
      case 'top-left':
        return 'top-20 left-0'
      default:
        return 'bottom-20 right-0'
    }
  }

  // Update unread count when new messages arrive
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant') {
        setUnreadCount(prev => prev + 1)
      }
    }
  }, [messages, isOpen])

  // Clear unread count when opening chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
    setIsOpen(false)
  }

  return (
    <div className={`fixed z-[9999] ${getPositionClasses()}`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`absolute ${getChatPosition()}`}
            style={{
              width: '400px',
              height: '700px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Chat Header */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderBottom: '1px solid #e5e7eb',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Bot size={24} color="white" />
                  </div>
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    backgroundColor: isConnected ? '#10b981' : '#f59e0b'
                  }}></span>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {agentInfo?.name || 'Assistente IA'}
                  </p>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: isConnected ? '#10b981' : '#f59e0b',
                    margin: 0
                  }}>
                    {isConnected ? 'Online' : 'Conectando...'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button 
                  onClick={minimizeChat} 
                  style={{
                    color: '#9ca3af',
                    padding: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Minus size={20} />
                </button>
                <button 
                  onClick={toggleChat} 
                  style={{
                    color: '#9ca3af',
                    padding: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Interface */}
            <div style={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
              <ChatInterface
                messages={messages}
                isTyping={isTyping}
                onSendMessage={sendMessage}
                onUploadFile={uploadFile}
                agentInfo={agentInfo}
                input={input}
                setInput={setInput}
                attachments={attachments}
                setAttachments={setAttachments}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute ${getChatPosition()} cursor-pointer`}
            style={{
              width: '288px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              padding: '12px'
            }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot size={24} color="white" />
                </div>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </motion.div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ 
                  fontWeight: '600', 
                  fontSize: '14px', 
                  color: '#111827',
                  margin: 0
                }}>
                  {agentInfo?.name || 'Assistente IA'}
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  margin: 0
                }}>
                  Clique para reabrir o chat
                </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }} 
                style={{
                  color: '#9ca3af',
                  padding: '6px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1, rotate: isOpen ? 45 : 0 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: config.primaryColor || 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'message'}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
          </motion.div>
        </AnimatePresence>
        {!isOpen && unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.5 }}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '24px',
              height: '24px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white'
            }}
          >
            <span style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </motion.button>
    </div>
  )
}