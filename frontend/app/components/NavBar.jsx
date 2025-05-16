'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet } from '../hooks/useWallet'

// Inline SVG logo component with gradient
const BacklotLogo = () => (
   <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 1600 900" 
    className="w-32"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#831010" />
        <stop offset="100%" stopColor="#C13584" />
      </linearGradient>
    </defs>
    <path fill="url(#logoGradient)" d="m832 610.9h-226v-322.8h64.6v258.3h161.4c17.8 0 32.2 14.4 32.2 32.2 0 17.9-14.4 32.3-32.2 32.3z"/>
    <path fill="url(#logoGradient)" d="m828.2 740h-157.6c-35.7 0-64.6-28.9-64.6-64.5h223.1c52.1 0 97-40 99.6-92 2.7-55.6-41.7-101.7-96.8-101.7h-96.8v-64.6h94c52.1 0 97-39.9 99.6-91.9 2.7-55.6-41.7-101.7-96.8-101.7h-225.9c0-35.7 28.9-64.6 64.6-64.6h157.6c89.4 0 165.8 73.1 165.1 162.6-0.3 52.2-25.7 98.7-64.6 127.9 38.9 29.3 64.3 75.7 64.6 128 0.7 89.4-75.7 162.5-165.1 162.5z"/>
    <path fill="url(#logoGradient)" d="m832 352.7h-96.9v-64.6h96.9c17.8 0 32.2 14.5 32.2 32.3 0 17.8-14.4 32.3-32.2 32.3z"/>
  </svg>
)

export default function NavBar({ isCreator = false }) {
  const { isConnected, formattedAddress } = useWallet()
  const gradient = isCreator
    ? 'from-blue-400 to-cyan-500'
    : 'from-pink-400 to-purple-500'
  
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-gray-800/80 backdrop-blur-sm h-16">
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center">
          <BacklotLogo />
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