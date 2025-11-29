'use client'

import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ReactionPanel from './ReactionPanel'
import addresses from '@/contracts/addresses.json'
import ChatABI from '@/contracts/Chat.json'

interface ChatInterfaceProps {
  address: string
}

export default function ChatInterface({ address }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeContract()
  }, [])

  useEffect(() => {
    if (contract) {
      loadMessages()
      // Listen for new messages
      contract.on('MessagePosted', (messageId, author, content, timestamp) => {
        loadMessages()
      })
    }
  }, [contract])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeContract = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const chatContract = new ethers.Contract(
          addresses.chat,
          ChatABI,
          signer
        )
        setContract(chatContract)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error initializing contract:', error)
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    if (!contract) return

    try {
      const totalMessages = await contract.getTotalMessages()
      const messagePromises = []
      
      for (let i = 1; i <= totalMessages; i++) {
        messagePromises.push(contract.getMessage(i))
      }

      const messageData = await Promise.all(messagePromises)
      const formattedMessages = messageData.map((msg: any, index: number) => ({
        id: index + 1,
        author: msg.author,
        content: msg.content,
        timestamp: Number(msg.timestamp),
      }))

      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handlePostMessage = async (content: string) => {
    if (!contract) return

    try {
      const tx = await contract.postMessage(content)
      await tx.wait()
      await loadMessages()
    } catch (error) {
      console.error('Error posting message:', error)
      alert('Failed to post message. Please try again.')
    }
  }

  const handleAddReaction = async (
    messageId: number,
    reactionType: 'like' | 'dislike' | 'interesting' | 'notInteresting' | 'toxicity'
  ) => {
    if (!contract) {
      alert('Please wait for contract to initialize')
      return
    }

    try {
      // For Sepolia version, reactions are not encrypted (simplified version)
      const reactions = {
        like: reactionType === 'like' ? 1 : 0,
        dislike: reactionType === 'dislike' ? 1 : 0,
        interesting: reactionType === 'interesting' ? 1 : 0,
        notInteresting: reactionType === 'notInteresting' ? 1 : 0,
        toxicity: reactionType === 'toxicity' ? 1 : 0,
      }

      const tx = await contract.addReaction(
        messageId,
        reactions.like,
        reactions.dislike,
        reactions.interesting,
        reactions.notInteresting,
        reactions.toxicity
      )
      await tx.wait()
      alert('Reaction added successfully!')
    } catch (error: any) {
      console.error('Error adding reaction:', error)
      alert(`Failed to add reaction: ${error.message || 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-base text-telegram-text-secondary">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="bg-telegram-background rounded-lg border border-telegram-border h-[calc(100vh-180px)] flex flex-col">
      <div className="px-4 py-3 border-b border-telegram-border">
        <h2 className="text-lg font-semibold text-telegram-text">
          Global Chat
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <MessageList messages={messages} onReaction={handleAddReaction} />
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-telegram-border">
        <MessageInput onPostMessage={handlePostMessage} />
      </div>
    </div>
  )
}

