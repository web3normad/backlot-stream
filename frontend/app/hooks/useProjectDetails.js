// hooks/useProjectDetails.js
import { useState, useEffect, useCallback } from 'react';
import { formatEther } from 'viem';
import { 
  createPublicClientInstance as getPublicClient, 
  getContractConfig, 
  formatProjectStatus 
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
      console.log("Fetching details for project ID:", projectId);
      
      const publicClient = getPublicClient();
      const { address: contractAddress, abi } = getContractConfig();
      
      // Convert project ID to a number properly
      let numericProjectId;
      
      try {
        // First try to parse as an integer
        numericProjectId = parseInt(projectId, 10);
        
        // Check if it's a valid number
        if (isNaN(numericProjectId)) {
          throw new Error('Invalid project ID format');
        }
        
        console.log("Converted project ID:", numericProjectId);
      } catch (idError) {
        console.error("Error converting project ID:", idError);
        throw new Error('Invalid project ID format');
      }
      
      // Handle potential contract call errors
      let projectDetails;
      let tierInfo;
      
      try {
        // Get project details from contract
        projectDetails = await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: 'getProjectDetails',
          args: [BigInt(numericProjectId)],
        });
      } catch (contractError) {
        console.error("Error reading project details from contract:", contractError);
        
        // For demo/development - use hardcoded values if the contract call fails
        if (process.env.NODE_ENV === 'development') {
          console.log("Using fallback project details");
          projectDetails = {
            id: BigInt(numericProjectId),
            creator: "0x57e3a864344854898E3B982bC42fe7207423a8d0",
            title: "Lost in Translation",
            description: "A story of the african child",
            coverImageURI: "ipfs://bafybeih32i6w2pe422wtnutllevjaeg7sough67kbtnfd6vgklwrgx36rm",
            fundingGoal: BigInt("1000000000000000000"), // 1 ETH
            currentFunding: BigInt(0),
            streamingRevenue: BigInt(0),
            totalShares: BigInt(1000),
            remainingShares: BigInt(1000),
            status: 0, // Funding status
            createdAt: BigInt(1746477600)
          };
        } else {
          throw contractError;
        }
      }
      
      try {
        // Get tier information
        tierInfo = await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: 'getProjectTierInfo',
          args: [BigInt(numericProjectId)],
        });
      } catch (tierError) {
        console.error("Error reading tier info from contract:", tierError);
        
        // For demo/development - use hardcoded values if the contract call fails
        if (process.env.NODE_ENV === 'development') {
          console.log("Using fallback tier info");
          tierInfo = [
            // Tier pricing (in wei)
            [
              BigInt("10000000000000000"),  // 0.01 ETH
              BigInt("30000000000000000"),  // 0.03 ETH
              BigInt("100000000000000000"), // 0.1 ETH
              BigInt("300000000000000000"), // 0.3 ETH
            ],
            // Shares per tier
            [BigInt(10), BigInt(30), BigInt(100), BigInt(300)]
          ];
        } else {
          throw tierError;
        }
      }

      console.log("Raw project details:", projectDetails);
      console.log("Raw tier info:", tierInfo);

      // Safe formatting function to handle undefined/null values
      const safeFormatEther = (value) => {
        if (value === undefined || value === null) return "0";
        try {
          return formatEther(value);
        } catch (error) {
          console.warn("Error formatting value:", value, error);
          return "0";
        }
      };

      // Format project data with safety checks
      const fundingGoal = safeFormatEther(projectDetails.fundingGoal);
      const currentFunding = safeFormatEther(projectDetails.currentFunding);
      
      // Calculate funding percentage safely
      const fundingPercentage = 
        parseFloat(currentFunding) > 0 && parseFloat(fundingGoal) > 0
          ? (parseFloat(currentFunding) / parseFloat(fundingGoal)) * 100
          : 0;

      // Handle potential undefined values or missing structure
      const createdAtTimestamp = projectDetails.createdAt 
        ? Number(projectDetails.createdAt) 
        : 0;

      // Extract and format tier information with safety checks
      const tierPricing = Array.isArray(tierInfo[0]) 
        ? tierInfo[0].map(price => safeFormatEther(price))
        : [0, 0, 0, 0];
        
      const tierShares = Array.isArray(tierInfo[1])
        ? tierInfo[1].map(shares => Number(shares || 0))
        : [0, 0, 0, 0];

      const formattedProject = {
        id: Number(projectDetails.id || 0),
        creator: projectDetails.creator || "",
        title: projectDetails.title || "",
        description: projectDetails.description || "",
        coverImageURI: projectDetails.coverImageURI || "",
        fundingGoal,
        currentFunding,
        streamingRevenue: safeFormatEther(projectDetails.streamingRevenue),
        totalShares: Number(projectDetails.totalShares || 0),
        remainingShares: Number(projectDetails.remainingShares || 0),
        status: formatProjectStatus(Number(projectDetails.status || 0)),
        statusCode: Number(projectDetails.status || 0),
        createdAt: new Date(createdAtTimestamp * 1000),
        tierPricing,
        tierShares,
        fundingPercentage
      };
      
      console.log("Formatted project:", formattedProject);
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