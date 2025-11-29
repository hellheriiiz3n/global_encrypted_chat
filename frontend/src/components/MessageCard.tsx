'use client'

import { useState } from 'react'
import ReactionPanel from './ReactionPanel'

interface Message {
  id: number
  author: string
  content: string
  timestamp: number
}

interface MessageCardProps {
  message: Message
  isSelected: boolean
  onSelect: () => void
  onReaction?: (messageId: number, type: 'like' | 'dislike' | 'interesting' | 'notInteresting' | 'toxicity') => void
}

export default function MessageCard({ message, isSelected, onSelect, onReaction }: MessageCardProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div
      className={`message-card cursor-pointer ${
        isSelected ? 'border-telegram-blue border-2 bg-telegram-blue-light' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-telegram-blue">
            {formatAddress(message.author)}
          </span>
          <span className="text-xs text-telegram-text-secondary">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <span className="text-xs text-telegram-text-secondary">#{message.id}</span>
      </div>
      
      <p className="text-telegram-text mb-2 whitespace-pre-wrap leading-relaxed">
        {message.content}
      </p>

      {isSelected && onReaction && (
        <div className="mt-3 pt-3 border-t border-telegram-border">
          <ReactionPanel messageId={message.id} onReaction={onReaction} />
        </div>
      )}
    </div>
  )
}

