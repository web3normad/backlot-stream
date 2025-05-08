// hooks/useInvestment.js
import { useState, useCallback } from 'react';
import { parseEther } from 'viem';
import { createWalletClientInstance, getContractConfig, createPublicClientInstance } from '../utils/contract';

export const useInvestment = () => {
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentError, setInvestmentError] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  const investInProject = useCallback(async (projectId, tier, amount) => {
    if (!projectId || (tier !== 0 && !tier) || !amount) {
      setInvestmentError("Invalid investment parameters");
      return false;
    }

    setIsInvesting(true);
    setInvestmentError(null);
    setTransactionHash(null);
    setInvestmentSuccess(false);

    try {
      // Get wallet client
      const walletClient = await createWalletClientInstance();
      
      // Get contract config
      const { address: contractAddress, abi } = getContractConfig();
      
      // Convert amount to wei
      const investmentAmount = parseEther(amount.toString());
      
      console.log("Investing:", {
        projectId: BigInt(projectId), 
        tier, 
        amount: investmentAmount
      });
      
      // Call contract's investInProject function
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi,
        functionName: 'investInProject',
        args: [BigInt(projectId), tier],
        value: investmentAmount,
      });

      setTransactionHash(hash);
      console.log("Transaction submitted:", hash);
      
      // Get public client to wait for transaction confirmation
      const publicClient = createPublicClientInstance();
      
      // Wait for transaction to be mined
      await publicClient.waitForTransactionReceipt({ hash });
      
      setInvestmentSuccess(true);
      return true;
    } catch (error) {
      console.error('Investment error:', error);
      setInvestmentError(error.message || 'Failed to invest in project');
      return false;
    } finally {
      setIsInvesting(false);
    }
  }, []);

  return {
    investInProject,
    isInvesting,
    investmentError,
    transactionHash,
    investmentSuccess,
    resetInvestment: () => {
      setInvestmentError(null);
      setTransactionHash(null);
      setInvestmentSuccess(false);
    }
  };
};