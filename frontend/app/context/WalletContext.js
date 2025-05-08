// context/WalletContext.js
"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAddress } from 'viem';
import { 
  CONTRACT_ADDRESS, 
  CONTRACT_ABI, 
  createPublicClientInstance,
  createWalletClientInstance,
  ensureCorrectNetwork
} from '../utils/contract';
import { useAccount, useDisconnect } from 'wagmi';

// Create context
const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  // RainbowKit hooks
  const { address, isConnected: isWagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  // Local state
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletClient, setWalletClient] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Determine user role (creator/investor)
  const determineUserRole = async (address) => {
    try {
      const publicClient = createPublicClientInstance();
      
      // Check if user has any projects (creator)
      const creatorEvents = await publicClient.getContractEvents({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: 'ProjectCreated',
        args: { creator: address },
        fromBlock: 'earliest'
      });
      
      if (creatorEvents.length > 0) {
        setUserRole('creator');
        return;
      }
      
      // Check if user has any investments (investor)
      const investorEvents = await publicClient.getContractEvents({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: 'InvestmentMade',
        args: { investor: address },
        fromBlock: 'earliest'
      });
      
      if (investorEvents.length > 0) {
        setUserRole('investor');
        return;
      }
      
      setUserRole(null);
    } catch (err) {
      console.error('Error determining user role:', err);
      setUserRole(null);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    wagmiDisconnect();
    setAccount(null);
    setIsConnected(false);
    setWalletClient(null);
    setUserRole(null);
  };

  // Sync RainbowKit state with local state
  useEffect(() => {
    const syncWalletState = async () => {
      setIsLoading(true);
      
      try {
        if (isWagmiConnected && address) {
          const checksummedAddress = getAddress(address);
          const client = createWalletClientInstance();
          
          setAccount(checksummedAddress);
          setIsConnected(true);
          setWalletClient(client);
          await determineUserRole(checksummedAddress);
          
          // Ensure correct network
          await ensureCorrectNetwork();
        } else {
          setAccount(null);
          setIsConnected(false);
          setWalletClient(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Error syncing wallet state:', err);
        setError(err.message || 'Failed to sync wallet state');
      } finally {
        setIsLoading(false);
      }
    };

    syncWalletState();
  }, [isWagmiConnected, address]);

  // For backward compatibility
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isWagmiConnected && address) {
        await ensureCorrectNetwork();
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletContext.Provider value={{
      account,
      isConnected,
      isLoading,
      error,
      walletClient,
      userRole,
      connectWallet,
      disconnectWallet,
      setUserRole
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};