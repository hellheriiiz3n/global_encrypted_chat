'use client'

import { useState } from 'react'

interface ReactionPanelProps {
  messageId: number
  onReaction: (messageId: number, type: 'like' | 'dislike' | 'interesting' | 'notInteresting' | 'toxicity') => void
}

export default function ReactionPanel({ messageId, onReaction }: ReactionPanelProps) {
  const [reacting, setReacting] = useState(false)

  const handleReaction = async (type: 'like' | 'dislike' | 'interesting' | 'notInteresting' | 'toxicity') => {
    if (reacting) return

    try {
      setReacting(true)
      await onReaction(messageId, type)
    } catch (error) {
      console.error('Error adding reaction:', error)
    } finally {
      setReacting(false)
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-telegram-text mb-2">
        Add encrypted reaction:
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleReaction('like')}
          disabled={reacting}
          className="reaction-button"
        >
          👍 Like
        </button>
        <button
          onClick={() => handleReaction('dislike')}
          disabled={reacting}
          className="reaction-button"
        >
          👎 Dislike
        </button>
        <button
          onClick={() => handleReaction('interesting')}
          disabled={reacting}
          className="reaction-button"
        >
          💡 Interesting
        </button>
        <button
          onClick={() => handleReaction('notInteresting')}
          disabled={reacting}
          className="reaction-button"
        >
          😴 Not Interesting
        </button>
        <button
          onClick={() => handleReaction('toxicity')}
          disabled={reacting}
          className="reaction-button"
        >
          ⚠️ Report
        </button>
      </div>
      <p className="text-xs text-telegram-text-secondary mt-2">
        Your reactions are encrypted and private
      </p>
    </div>
  )
}

