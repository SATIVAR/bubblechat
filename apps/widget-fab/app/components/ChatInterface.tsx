"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Paperclip, Image, FileText, ThumbsUp, ThumbsDown, User, Bot, Clock, X } from "lucide-react"

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
}

interface ChatInterfaceProps {
  messages: Message[]
  isTyping: boolean
  onSendMessage: (content: string, attachments?: File[]) => void
  onUploadFile: (file: File) => Promise<FileAttachment>
  agentInfo?: AgentInfo
}

export function ChatInterface({ 
  messages, 
  isTyping, 
  onSendMessage, 
  onUploadFile, 
  agentInfo,
  input,
  setInput,
  attachments,
  setAttachments
}: ChatInterfaceProps & {
  input: string;
  setInput: (value: string) => void;
  attachments: File[];
  setAttachments: (files: File[]) => void;
}) {

  const [isDragging, setIsDragging] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return

    onSendMessage(input, attachments)
    setInput("")
    setAttachments([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setAttachments(prev => [...prev, ...files])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />
    return <Paperclip className="w-4 h-4" />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f9fafb' }}>
      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Welcome Message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '40px 0' }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <Bot size={40} color="white" />
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '8px',
              margin: 0
            }}>
              {agentInfo?.name || 'Assistente IA'}
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              maxWidth: '320px',
              margin: '8px auto 0',
              lineHeight: '1.5'
            }}>
              {agentInfo?.description || 'Olá! Como posso te ajudar hoje? Sinta-se à vontade para me enviar mensagens ou arquivos.'}
            </p>
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              justifyContent: message.role === "user" ? "flex-end" : "flex-start"
            }}
          >
            {/* Avatar */}
            {message.role === 'assistant' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
              }}>
                <Bot size={20} color="white" />
              </div>
            )}

            {/* Message Content */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '85%',
              alignItems: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                borderRadius: message.role === "user" ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '12px 16px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                backgroundColor: message.role === "user" ? "#3b82f6" : "white",
                color: message.role === "user" ? "white" : "#1f2937"
              }}>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  margin: 0
                }}>
                  {message.content}
                </p>
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {message.attachments.map((attachment) => (
                      <div key={attachment.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: message.role === 'user' ? 'rgba(59, 130, 246, 0.3)' : '#f3f4f6'
                      }}>
                        <div style={{ color: message.role === 'user' ? 'white' : '#6b7280' }}>
                          {getFileIcon(attachment.type)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {attachment.name}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            margin: 0
                          }}>
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp and Feedback */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '6px',
                paddingLeft: '8px',
                paddingRight: '8px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  margin: 0
                }}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                
                {message.role === "assistant" && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button style={{
                      padding: '4px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: message.feedback === 'positive' ? '#10b981' : '#9ca3af',
                      transition: 'color 0.2s'
                    }}>
                      <ThumbsUp size={14} />
                    </button>
                    <button style={{
                      padding: '4px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: message.feedback === 'negative' ? '#ef4444' : '#9ca3af',
                      transition: 'color 0.2s'
                    }}>
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
             {message.role === 'user' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                backgroundColor: '#d1d5db'
              }}>
                <User size={20} color="#6b7280" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bot size={20} color="white" />
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px 16px 16px 4px',
              padding: '12px 16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: '0ms'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: '150ms'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: '300ms'
                }}></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Drag and Drop Overlay */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '2px dashed #3b82f6',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Paperclip size={40} color="#3b82f6" style={{ margin: '0 auto 12px' }} />
              <p style={{
                fontSize: '18px',
                color: '#2563eb',
                fontWeight: '600',
                margin: 0
              }}>
                Arraste e solte para enviar
              </p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        borderTop: '1px solid #e5e7eb',
        padding: '16px',
        backgroundColor: 'white'
      }}>
        {/* Attachments Preview */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginBottom: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                overflow: 'hidden'
              }}
            >
              {attachments.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ color: '#6b7280' }}>{getFileIcon(file.type)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {file.name}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    style={{
                      color: '#9ca3af',
                      padding: '4px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          {/* File Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '40px',
              height: '40px',
              flexShrink: 0,
              backgroundColor: '#e5e7eb',
              color: '#6b7280',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
          >
            <Paperclip size={20} />
          </button>

          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              style={{
                width: '100%',
                resize: 'none',
                borderRadius: '16px',
                border: '1px solid #d1d5db',
                backgroundColor: '#f3f4f6',
                padding: '10px 16px',
                fontSize: '14px',
                color: '#1f2937',
                outline: 'none',
                maxHeight: '144px',
                fontFamily: 'inherit'
              }}
              rows={1}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
                e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() && attachments.length === 0}
            style={{
              width: '40px',
              height: '40px',
              flexShrink: 0,
              backgroundColor: (!input.trim() && attachments.length === 0) ? '#9ca3af' : '#3b82f6',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: (!input.trim() && attachments.length === 0) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              if (!(!input.trim() && attachments.length === 0)) {
                e.currentTarget.style.backgroundColor = '#2563eb'
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (!(!input.trim() && attachments.length === 0)) {
                e.currentTarget.style.backgroundColor = '#3b82f6'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
          >
            <Send size={20} />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.xlsx,.xls,.csv,.doc,.docx"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}