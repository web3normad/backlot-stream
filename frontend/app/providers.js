'use client'

import * as React from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { http } from 'viem'

// Validate the project ID exists
if (!process.env.NEXT_PUBLIC_WALLETCONNECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_ID environment variable')
}

const config = getDefaultConfig({
  appName: 'BacklotFlix',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID, 
  chains: [baseSepolia],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) 
  }
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  
  return (
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
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}