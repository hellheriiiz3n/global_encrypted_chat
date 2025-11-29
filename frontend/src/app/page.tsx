'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import ChatInterface from '@/components/ChatInterface'
import StatsPanel from '@/components/StatsPanel'
import Header from '@/components/Header'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()

  return (
    <main className="min-h-screen bg-telegram-background">
      <Header 
        isConnected={isConnected}
        address={address}
        onConnect={() => open()}
        onDisconnect={() => disconnect()}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-4xl font-semibold mb-3 text-telegram-text">
                Global Chat
              </h1>
              <p className="text-lg mb-8 text-telegram-text-secondary">
                Connect your wallet to start chatting with privacy-preserving reactions
              </p>
              <button
                onClick={() => open()}
                className="bg-telegram-blue hover:bg-telegram-blue-hover text-white font-medium py-3 px-8 rounded-lg text-base transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <ChatInterface address={address!} />
            </div>
            <div className="lg:col-span-1">
              <StatsPanel />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

