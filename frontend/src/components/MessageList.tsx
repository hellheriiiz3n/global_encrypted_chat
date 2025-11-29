'use client'

import { useState } from 'react'
import MessageCard from './MessageCard'

interface Message {
  id: number
  author: string
  content: string
  timestamp: number
}

interface MessageListProps {
  messages: Message[]
  onReaction?: (messageId: number, type: 'like' | 'dislike' | 'interesting' | 'notInteresting' | 'toxicity') => void
}

export default function MessageList({ messages, onReaction }: MessageListProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-telegram-text-secondary">
        <p className="text-base">No messages yet. Be the first to post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          isSelected={selectedMessageId === message.id}
          onSelect={() => setSelectedMessageId(selectedMessageId === message.id ? null : message.id)}
          onReaction={onReaction}
        />
      ))}
    </div>
  )
}

