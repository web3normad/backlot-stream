// hooks/useProjectDetails.js
import { useState, useEffect, useCallback } from 'react';
import { formatEther } from 'viem';
import { 
  getPublicClient,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  formatProjectStatus,
  formatEth,
  calculateProgress
} from '../utils/contract';

export const useProjectDetails = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const publicClient = getPublicClient();
      
      // Convert project ID to a BigInt
      const numericProjectId = BigInt(projectId);
      
      // Get project details using the projects mapping
      const projectDetailsRaw = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'projects',
        args: [numericProjectId],
      });

      console.log('Raw project details:', projectDetailsRaw);

      // Convert array to structured object - this is the critical fix
      // The issue is that the contract returns an array, not an object with named properties
      const projectDetails = {
        id: projectDetailsRaw[0],
        creator: projectDetailsRaw[1],
        title: projectDetailsRaw[2],
        description: projectDetailsRaw[3],
        coverImageURI: projectDetailsRaw[4],
        fundingGoal: projectDetailsRaw[5],
        currentFunding: projectDetailsRaw[6],
        streamingRevenue: projectDetailsRaw[7],
        totalShares: projectDetailsRaw[8],
        remainingShares: projectDetailsRaw[9],
        status: projectDetailsRaw[10],
        createdAt: projectDetailsRaw[11]
      };

      // Get tier info
      const tierInfo = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProjectTierInfo',
        args: [numericProjectId],
      });

      // Safe formatting function
      const safeFormatEther = (value) => {
        if (value === undefined || value === null) return "0";
        try {
          return formatEther(value);
        } catch (error) {
          console.warn("Error formatting value:", value, error);
          return "0";
        }
      };

      // Format project data
      const formattedProject = {
        id: Number(projectId),
        creator: projectDetails.creator || "",
        title: projectDetails.title || "",
        description: projectDetails.description || "",
        coverImageURI: projectDetails.coverImageURI || "",
        fundingGoal: safeFormatEther(projectDetails.fundingGoal),
        currentFunding: safeFormatEther(projectDetails.currentFunding),
        streamingRevenue: safeFormatEther(projectDetails.streamingRevenue),
        totalShares: Number(projectDetails.totalShares || 0),
        remainingShares: Number(projectDetails.remainingShares || 0),
        status: formatProjectStatus(Number(projectDetails.status || 0)),
        statusCode: Number(projectDetails.status || 0),
        createdAt: new Date(Number(projectDetails.createdAt || 0) * 1000),
        tierPricing: tierInfo[0]?.map(price => safeFormatEther(price)) || ["0", "0", "0", "0"],
        tierPricingFormatted: tierInfo[0]?.map(price => formatEth(price)) || ["0 ETH", "0 ETH", "0 ETH", "0 ETH"],
        tierShares: tierInfo[1]?.map(shares => Number(shares || 0)) || [0, 0, 0, 0],
        fundingPercentage: calculateProgress(
          safeFormatEther(projectDetails.currentFunding),
          safeFormatEther(projectDetails.fundingGoal)
        )
      };
      
      console.log('Processed project details:', formattedProject);
      setProject(formattedProject);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError('Failed to fetch project details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId, fetchProjectDetails]);

  return {
    project,
    loading,
    error,
    refreshProject: fetchProjectDetails
  };
};