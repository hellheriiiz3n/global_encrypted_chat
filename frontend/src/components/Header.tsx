'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'

interface HeaderProps {
  isConnected: boolean
  address: string | undefined
  onConnect: () => void
  onDisconnect: () => void
}

export default function Header({ isConnected, address, onConnect, onDisconnect }: HeaderProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="bg-telegram-background border-b border-telegram-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold text-telegram-blue">
            Global Chat
          </h1>
          <span className="text-xs bg-telegram-blue-light text-telegram-blue px-2 py-0.5 rounded">
            Privacy
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <>
              <span className="text-sm text-telegram-text-secondary">
                {formatAddress(address!)}
              </span>
              <button
                onClick={onDisconnect}
                className="bg-telegram-background-secondary hover:bg-telegram-border text-telegram-text px-4 py-1.5 rounded-lg transition-colors text-sm"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={onConnect}
              className="bg-telegram-blue hover:bg-telegram-blue-hover text-white px-4 py-1.5 rounded-lg transition-colors text-sm font-medium"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

