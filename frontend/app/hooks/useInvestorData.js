// hooks/useInvestorData.js
import { useState, useEffect, useCallback } from 'react';
import { formatEther } from 'viem';
import { getPublicClient, getContractConfig, formatTier } from '../utils/contract';

export const useInvestorData = (address) => {
  const [investments, setInvestments] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvestorData = useCallback(async () => {
    if (!address) return;
    
    setLoading(true);
    setError(null);

    try {
      const publicClient = getPublicClient();
      const { address: contractAddress, abi } = getContractConfig();
      
      // Get all ProjectCreated events to find all projects
      const projectEvents = await publicClient.getContractEvents({
        address: contractAddress,
        abi,
        eventName: 'ProjectCreated',
        fromBlock: 'earliest',
      });
      
      // Get all InvestmentMade events where this address is the investor
      const investmentEvents = await publicClient.getContractEvents({
        address: contractAddress,
        abi,
        eventName: 'InvestmentMade',
        args: {
          investor: address // filter by investor address
        },
        fromBlock: 'earliest',
      });
      
      // Process investment data
      const investmentData = [];
      const tokenData = [];
      
      for (const event of investmentEvents) {
        const projectId = Number(event.args.projectId);
        const tokenId = Number(event.args.tokenId);
        const tierCode = event.args.tier;
        const amount = formatEther(event.args.amount);
        const shares = Number(event.args.shares);
        
        // Fetch token details
        try {
          const nft = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: 'investorNFTs',
            args: [tokenId],
          });
          
          // Find project details
          const projectDetails = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: 'getProjectDetails',
            args: [projectId],
          });
          
          const investment = {
            projectId,
            tokenId,
            tier: formatTier(tierCode),
            tierCode,
            amount,
            shares,
            projectTitle: projectDetails.title,
            projectStatus: projectDetails.status,
            coverImageURI: projectDetails.coverImageURI
          };
          
          investmentData.push(investment);
          tokenData.push({
            tokenId,
            projectId,
            tier: formatTier(tierCode),
            shares,
            amount
          });
        } catch (e) {
          console.error(`Error fetching token ${tokenId} details:`, e);
        }
      }
      
      setInvestments(investmentData);
      setTokens(tokenData);
    } catch (error) {
      console.error('Error fetching investor data:', error);
      setError('Failed to fetch investment data');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchInvestorData();
    }
  }, [address, fetchInvestorData]);

  return {
    investments,
    tokens,
    loading,
    error,
    refreshInvestorData: fetchInvestorData
  };
};