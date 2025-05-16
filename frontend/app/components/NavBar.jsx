'use client'

import Link from 'next/link'
import { Film } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet } from '../hooks/useWallet'

export default function NavBar({ isCreator = false }) {
  const { isConnected, formattedAddress } = useWallet()
  const gradient = isCreator 
    ? 'from-blue-400 to-cyan-500' 
    : 'from-pink-400 to-purple-500'
  
  const iconColor = isCreator ? 'text-blue-500' : 'text-pink-500'

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-gray-800/80 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <Film className={iconColor} size={32} />
        <Link href="/" className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
          Backlot
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <Link href="/projects" className="text-white hover:text-gray-300 transition-colors">
          Projects
        </Link>
        <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
          Dashboard
        </Link>
        <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
          About
        </Link>
        <div className="hidden sm:block">
          <ConnectButton 
            accountStatus="address"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
        <div className="sm:hidden">
          <ConnectButton 
            accountStatus="avatar"
            chainStatus="none"
            showBalance={false}
          />
        </div>
      </div>
    </nav>
  )
}