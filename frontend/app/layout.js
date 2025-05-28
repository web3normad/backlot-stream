'use client'

import './globals.css'
import { useState, useEffect } from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base, zora, baseSepolia } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { WalletProvider } from './context/WalletContext'

const config = getDefaultConfig({
  appName: 'BacklotFlix',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '',
  chains: [mainnet, polygon, optimism, arbitrum, base, zora, baseSepolia],
  ssr: true,
})



const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider 
              theme={darkTheme({
                accentColor: '#EC4899',
                accentColorForeground: 'white',
                borderRadius: 'medium',
                fontStack: 'system',
                overlayBlur: 'small',
              })}
            >
              <WalletProvider>
                {mounted && children}
              </WalletProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}