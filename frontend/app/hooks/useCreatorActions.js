"use client"
import { useState, useCallback } from 'react';
import { parseEther } from 'viem';
import { 
  createWalletClientInstance as getWalletClient,
  createPublicClientInstance as getPublicClient,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  ensureCorrectNetwork,
  formatEth
} from '../utils/contract';

export const useCreatorActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  // Create a new project
  const createProject = useCallback(async (projectData) => {
    setIsProcessing(true);
    setError(null);
    setTransactionHash(null);

    try {
      // 1. Ensure correct network
      await ensureCorrectNetwork();
      
      // 2. Get wallet client with account
      const walletClient = await getWalletClient();
      
      // 3. Get public client
      const publicClient = getPublicClient();
      
      // 4. Get the connected account
      const [account] = await walletClient.getAddresses();
      if (!account) {
        throw new Error('No connected account found. Please connect your wallet.');
      }

      // 5. Prepare contract data
      const { 
        title,
        description,
        coverImageURI,
        fundingGoal,
        totalShares,
        tierPricing,
        tierShares
      } = projectData;

      // 6. Execute the contract write
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createProject',
        account, // Explicitly pass the account
        args: [
          title,
          description,
          coverImageURI,
          BigInt(fundingGoal),
          BigInt(totalShares),
          tierPricing.map(p => BigInt(p)),
          tierShares.map(s => BigInt(s))
        ],
      });

      setTransactionHash(hash);
      
      // 7. Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Project creation error:', error);
      setError(error.shortMessage || error.message || 'Failed to create project');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Update project status
  const updateProjectStatus = useCallback(async (projectId, newStatus) => {
    setIsProcessing(true);
    setError(null);
    setTransactionHash(null);

    try {
      await ensureCorrectNetwork();
      const walletClient = await getWalletClient();
      const publicClient = getPublicClient();
      
      const [account] = await walletClient.getAddresses();
      if (!account) {
        throw new Error('No connected account found');
      }

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'updateProjectStatus',
        account,
        args: [projectId, newStatus],
      });

      setTransactionHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (error) {
      console.error('Status update error:', error);
      setError(error.shortMessage || error.message || 'Failed to update project status');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Withdraw funds from a project
  const withdrawFunds = useCallback(async (projectId) => {
    setIsProcessing(true);
    setError(null);
    setTransactionHash(null);

    try {
      await ensureCorrectNetwork();
      const walletClient = await getWalletClient();
      const publicClient = getPublicClient();
      
      const [account] = await walletClient.getAddresses();
      if (!account) {
        throw new Error('No connected account found');
      }

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'withdrawFunds',
        account,
        args: [projectId],
      });

      setTransactionHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (error) {
      console.error('Withdraw funds error:', error);
      setError(error.shortMessage || error.message || 'Failed to withdraw funds');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Add streaming revenue
  const addStreamingRevenue = useCallback(async (projectId, amount) => {
    setIsProcessing(true);
    setError(null);
    setTransactionHash(null);

    try {
      await ensureCorrectNetwork();
      const walletClient = await getWalletClient();
      const publicClient = getPublicClient();
      
      const [account] = await walletClient.getAddresses();
      if (!account) {
        throw new Error('No connected account found');
      }

      const amountWei = parseEther(amount.toString());
      
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'addStreamingRevenue',
        account,
        args: [projectId],
        value: amountWei,
      });

      setTransactionHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (error) {
      console.error('Add revenue error:', error);
      setError(error.shortMessage || error.message || 'Failed to add streaming revenue');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Distribute revenue to investors
  const distributeRevenue = useCallback(async (projectId) => {
    setIsProcessing(true);
    setError(null);
    setTransactionHash(null);

    try {
      await ensureCorrectNetwork();
      const walletClient = await getWalletClient();
      const publicClient = getPublicClient();
      
      const [account] = await walletClient.getAddresses();
      if (!account) {
        throw new Error('No connected account found');
      }

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'distributeRevenue',
        account,
        args: [projectId],
      });

      setTransactionHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (error) {
      console.error('Revenue distribution error:', error);
      setError(error.shortMessage || error.message || 'Failed to distribute revenue');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Get project details
  const getProjectDetails = useCallback(async (projectId) => {
    try {
      const publicClient = getPublicClient();
      
      const project = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProjectDetails',
        args: [projectId],
      });

      return {
        id: project[0],
        creator: project[1],
        title: project[2],
        description: project[3],
        coverImageURI: project[4],
        fundingGoal: formatEth(project[5]),
        currentFunding: formatEth(project[6]),
        streamingRevenue: formatEth(project[7]),
        totalShares: project[8].toString(),
        remainingShares: project[9].toString(),
        status: project[10],
        createdAt: new Date(Number(project[11]) * 1000).toLocaleDateString()
      };
    } catch (error) {
      console.error('Error fetching project details:', error);
      throw error;
    }
  }, []);

  return {
    createProject,
    updateProjectStatus,
    withdrawFunds,
    addStreamingRevenue,
    distributeRevenue,
    getProjectDetails,
    isProcessing,
    error,
    transactionHash,
    clearError: () => setError(null),
    clearTransaction: () => setTransactionHash(null)
  };
};