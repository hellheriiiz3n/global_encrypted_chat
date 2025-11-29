'use client'

import { useState } from 'react'

interface MessageInputProps {
  onPostMessage: (content: string) => void
}

export default function MessageInput({ onPostMessage }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isPosting) return

    setIsPosting(true)
    try {
      await onPostMessage(content.trim())
      setContent('')
    } catch (error) {
      console.error('Error posting message:', error)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        maxLength={500}
        className="flex-1 px-4 py-2.5 border border-telegram-border rounded-lg focus:outline-none focus:border-telegram-blue bg-telegram-background text-telegram-text placeholder-telegram-text-secondary"
        disabled={isPosting}
      />
      <button
        type="submit"
        disabled={!content.trim() || isPosting}
        className="bg-telegram-blue hover:bg-telegram-blue-hover disabled:bg-telegram-background-secondary disabled:text-telegram-text-secondary disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        {isPosting ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}

