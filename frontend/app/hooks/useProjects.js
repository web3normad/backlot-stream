// hooks/useProjects.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { formatEther } from 'viem';
import { 
  getPublicClient,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  formatProjectStatus,
  getProjectsCount,
  formatEth,
  calculateProgress
} from '../utils/contract';

export const useProjects = (filterType = 'all', address = null, refreshTrigger = 0) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProjects, setTotalProjects] = useState(0);
  
  // Cache mechanism
  const projectCache = useRef(new Map());
  const isMountedRef = useRef(true);

  const safeFormatEther = (value) => {
    if (value === undefined || value === null) return "0";
    try {
      return formatEther(value);
    } catch (error) {
      return "0";
    }
  };

  const processProject = (projectData, projectId) => {
    if (!projectData || 
        projectData.creator === '0x0000000000000000000000000000000000000000' ||
        !projectData.title) {
      return null;
    }

    // Process IPFS URL
    let coverImageURI = projectData.coverImageURI || "";
    if (coverImageURI.startsWith('ipfs://')) {
      coverImageURI = `https://ipfs.io/ipfs/${coverImageURI.replace('ipfs://', '')}`;
    }

    const fundingGoal = safeFormatEther(projectData.fundingGoal);
    const currentFunding = safeFormatEther(projectData.currentFunding);
    const streamingRevenue = safeFormatEther(projectData.streamingRevenue);
    
    return {
      id: Number(projectId),
      creator: projectData.creator,
      title: projectData.title,
      description: projectData.description || "No description available",
      coverImageURI,
      fundingGoal,
      currentFunding,
      streamingRevenue,
      fundingGoalFormatted: formatEth(projectData.fundingGoal),
      currentFundingFormatted: formatEth(projectData.currentFunding),
      streamingRevenueFormatted: formatEth(projectData.streamingRevenue),
      totalShares: Number(projectData.totalShares || 0),
      remainingShares: Number(projectData.remainingShares || 0),
      status: formatProjectStatus(Number(projectData.status)),
      statusCode: Number(projectData.status || 0),
      createdAt: new Date(Number(projectData.createdAt || 0) * 1000),
      tierPricing: projectData.tierPricing?.map(price => safeFormatEther(price)) || ["0", "0", "0", "0"],
      tierPricingFormatted: projectData.tierPricing?.map(price => formatEth(price)) || ["0 ETH", "0 ETH", "0 ETH", "0 ETH"],
      tierShares: projectData.tierShares?.map(shares => Number(shares || 0)) || [0, 0, 0, 0],
      fundingPercentage: calculateProgress(currentFunding, fundingGoal)
    };
  };

 // Update the fetchProjectById function in useProjects.js

const fetchProjectById = async (projectId, publicClient) => {
  try {
    console.log(`Fetching project ${projectId}...`);
    
    // Check cache first
    if (projectCache.current.has(projectId)) {
      console.log(`Project ${projectId} found in cache`);
      return projectCache.current.get(projectId);
    }

    // Project details
    const projectDetailsRaw = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'projects',
      args: [BigInt(projectId)],
    });

    console.log(`Raw project details for ${projectId}:`, projectDetailsRaw);

    if (!projectDetailsRaw) {
      console.log(`Project ${projectId} details are null`);
      return null;
    }

    // Convert array to structured object - this is the critical fix
    // The issue is likely that the contract returns an array, not an object with named properties
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

    console.log(`Structured project details:`, projectDetails);

    if (projectDetails.creator === '0x0000000000000000000000000000000000000000') {
      console.log(`Project ${projectId} has zero address creator`);
      return null;
    }

    if (!projectDetails.title) {
      console.log(`Project ${projectId} has no title`);
      return null;
    }

    // Tier info
    const tierInfo = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'getProjectTierInfo',
      args: [BigInt(projectId)],
    });

    console.log(`Tier info for ${projectId}:`, tierInfo);

    const projectData = {
      ...projectDetails,
      tierPricing: tierInfo[0],
      tierShares: tierInfo[1]
    };

    const processedProject = processProject(projectData, projectId);
    
    // Cache the result
    if (processedProject) {
      projectCache.current.set(projectId, processedProject);
    }
    
    return processedProject;
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    return null;
  }
};

   

 const fetchProjectsByIds = async (ids, publicClient) => {
  console.log(`Fetching projects with IDs:`, ids);
  
  // Use Promise.allSettled to handle individual failures gracefully
  const projectPromises = ids.map(id => fetchProjectById(id, publicClient));
  const results = await Promise.allSettled(projectPromises);
  
  const successfulProjects = results
    .filter(result => result.status === 'fulfilled' && result.value)
    .map(result => result.value);

  const failedProjects = results
    .filter(result => result.status === 'rejected' || !result.value)
    .map(result => ({
      id: result.value?.id || 'unknown',
      error: result.reason || 'No project data returned'
    }));

  console.log(`Successfully fetched projects:`, successfulProjects);
  console.log(`Failed to fetch projects:`, failedProjects);
  
  return successfulProjects;
};

  const getProjectIdsByEvents = async (publicClient) => {
    let projectIds = new Set();
    
    try {
      const events = await publicClient.getContractEvents({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: 'ProjectCreated',
        fromBlock: 'earliest',
      });
      
      events.forEach(event => {
        if (event.args?.projectId) {
          projectIds.add(Number(event.args.projectId));
        }
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    
    return Array.from(projectIds).sort((a, b) => b - a); // Newest first
  };

  const fetchProjects = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setLoading(true);
    setError(null);

    try {
      const publicClient = getPublicClient();
      let projectIds = [];
      
      // First try to get count from contract
      try {
        const count = await getProjectsCount();
        setTotalProjects(Number(count));
        
        // Create array of all possible project IDs
        for (let i = 1; i <= Number(count); i++) {
          projectIds.push(i);
        }
      } catch (countError) {
        console.error("Error getting projects count:", countError);
        // Fallback to events if count fails
        projectIds = await getProjectIdsByEvents(publicClient);
      }
      
      // Fetch all projects
      let fetchedProjects = await fetchProjectsByIds(projectIds, publicClient);
      
      // Apply filters
      if (filterType === 'creator' && address) {
        fetchedProjects = fetchedProjects.filter(p => 
          p && p.creator.toLowerCase() === address.toLowerCase()
        );
      } else if (filterType === 'funding') {
        fetchedProjects = fetchedProjects.filter(p => p && p.statusCode === 0);
      } else if (filterType === 'streaming') {
        fetchedProjects = fetchedProjects.filter(p => p && p.statusCode === 2);
      }
      
      // Remove null values and sort by newest first
      fetchedProjects = fetchedProjects
        .filter(p => p !== null)
        .sort((a, b) => b.createdAt - a.createdAt);
      
      if (isMountedRef.current) {
        setProjects(fetchedProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (isMountedRef.current) {
        setError('Failed to load projects. Please refresh the page or try again later.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filterType, address]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchProjects();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchProjects, refreshTrigger]);

  return { 
    projects, 
    loading, 
    error, 
    totalProjects,
    refreshProjects: fetchProjects 
  };
};