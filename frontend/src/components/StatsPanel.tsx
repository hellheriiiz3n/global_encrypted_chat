'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import addresses from '@/contracts/addresses.json'
import ChatABI from '@/contracts/Chat.json'
import AggregationABI from '@/contracts/Aggregation.json'

export default function StatsPanel() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    chatMood: 'Neutral',
    loading: true,
  })

  useEffect(() => {
    loadStats()
    const interval = setInterval(loadStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const chatContract = new ethers.Contract(addresses.chat, ChatABI, provider)
        const aggregationContract = new ethers.Contract(
          addresses.aggregation,
          AggregationABI,
          provider
        )

        const totalMessages = await chatContract.getTotalMessages()
        
        // Note: getChatMood requires decryption permissions
        // For demo purposes, we'll use a simplified version
        const chatMood = 'Neutral' // await aggregationContract.getChatMood()

        setStats({
          totalMessages: Number(totalMessages),
          chatMood,
          loading: false,
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
      setStats((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <div className="bg-telegram-background rounded-lg border border-telegram-border p-4">
      <h2 className="text-lg font-semibold mb-4 text-telegram-text">
        Statistics
      </h2>

      {stats.loading ? (
        <div className="text-center py-8 text-telegram-text-secondary">Loading...</div>
      ) : (
        <div className="space-y-3">
          <div className="bg-telegram-blue-light p-3 rounded-lg">
            <div className="text-xs text-telegram-text-secondary mb-1">
              Total Messages
            </div>
            <div className="text-2xl font-semibold text-telegram-blue">
              {stats.totalMessages}
            </div>
          </div>

          <div className="bg-telegram-background-secondary p-3 rounded-lg">
            <div className="text-xs text-telegram-text-secondary mb-1">
              Chat Mood
            </div>
            <div className="text-lg font-medium text-telegram-text">
              {stats.chatMood}
            </div>
          </div>

          <div className="mt-4 p-3 bg-telegram-background-secondary rounded-lg">
            <h3 className="font-medium mb-2 text-sm text-telegram-text">
              Privacy Features
            </h3>
            <ul className="text-xs text-telegram-text-secondary space-y-1">
              <li>• Encrypted reactions</li>
              <li>• Private voting</li>
              <li>• Anonymous ratings</li>
              <li>• FHE aggregation</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

