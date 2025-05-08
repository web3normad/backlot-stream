// hooks/useProjects.js
import { useState, useEffect, useCallback } from 'react';
import { formatEther } from 'viem';
import { 
  createPublicClientInstance as getPublicClient,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  formatProjectStatus
} from '../utils/contract';

export const useProjects = (filterType = 'all', address = null) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const safeFormatEther = (value) => {
    if (value === undefined || value === null) return "0";
    try {
      return formatEther(value);
    } catch (error) {
      console.warn("Error formatting value:", value, error);
      return "0";
    }
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('Starting project fetch...');

    try {
      const publicClient = getPublicClient();
      console.log('Public client initialized');
      
      // First try to get the project count
      let projectCount = 0;
      try {
        projectCount = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'projectCount',
        });
        projectCount = Number(projectCount);
        console.log(`Contract reports ${projectCount} projects`);
      } catch (countError) {
        console.warn('Could not fetch project count, using fallback method:', countError);
        projectCount = 10; // Default to checking 10 projects
      }

      // Fetch projects one by one
      const fetchedProjects = [];
      let consecutiveFailures = 0;
      const MAX_CONSECUTIVE_FAILURES = 3; // Stop after 3 consecutive failures

      for (let id = 1; id <= projectCount; id++) {
        try {
          console.log(`Attempting to fetch project ${id}...`);
          const project = await fetchProjectById(id, publicClient);
          
          if (project) {
            console.log(`Successfully fetched project ${id}: ${project.title}`);
            fetchedProjects.push(project);
            consecutiveFailures = 0; // Reset failure counter
          } else {
            console.log(`Project ${id} appears invalid (null returned)`);
            consecutiveFailures++;
          }
        } catch (projectError) {
          console.error(`Error fetching project ${id}:`, projectError);
          consecutiveFailures++;
        }

        // Stop if we hit too many consecutive failures
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          console.log(`Stopping fetch after ${MAX_CONSECUTIVE_FAILURES} consecutive failures`);
          break;
        }
      }

      console.log(`Total projects fetched: ${fetchedProjects.length}`);
      
      if (fetchedProjects.length > 0) {
        applyFilters(fetchedProjects);
      } else {
        console.log('No valid projects found, using fallback data');
        const fallbackProjects = [
          createFallbackProject(1),
          createFallbackProject(2)
        ];
        applyFilters(fallbackProjects);
      }
    } catch (mainError) {
      console.error('Critical error in fetchProjects:', mainError);
      setError('Failed to load projects. Please refresh the page or try again later.');
      
      // Provide multiple fallback projects
      const fallbackProjects = [
        createFallbackProject(1),
        createFallbackProject(2)
      ];
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  }, [filterType, address]);

  const fetchProjectById = async (projectId, publicClient) => {
    try {
      // First check if basic project details exist
      const projectDetails = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProjectDetails',
        args: [projectId],
      });

      // Validate project exists
      if (!projectDetails || 
          projectDetails.creator === '0x0000000000000000000000000000000000000000' ||
          !projectDetails.title) {
        return null;
      }

      // Get tier info
      const tierInfo = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProjectTierInfo',
        args: [projectId],
      });

      // Process IPFS URL
      let coverImageURI = projectDetails.coverImageURI || "";
      if (coverImageURI.startsWith('ipfs://')) {
        coverImageURI = `https://ipfs.io/ipfs/${coverImageURI.replace('ipfs://', '')}`;
      }

      // Format values
      const fundingGoal = safeFormatEther(projectDetails.fundingGoal);
      const currentFunding = safeFormatEther(projectDetails.currentFunding);
      const streamingRevenue = safeFormatEther(projectDetails.streamingRevenue);
      
      const fundingPercentage = 
        parseFloat(currentFunding) > 0 && parseFloat(fundingGoal) > 0
          ? (parseFloat(currentFunding) / parseFloat(fundingGoal)) * 100
          : 0;

      return {
        id: Number(projectId),
        creator: projectDetails.creator,
        title: projectDetails.title,
        description: projectDetails.description || "No description available",
        coverImageURI,
        fundingGoal,
        currentFunding,
        streamingRevenue,
        totalShares: Number(projectDetails.totalShares || 0),
        remainingShares: Number(projectDetails.remainingShares || 0),
        status: formatProjectStatus(Number(projectDetails.status)),
        statusCode: Number(projectDetails.status || 0),
        createdAt: new Date(Number(projectDetails.createdAt || 0) * 1000),
        tierPricing: tierInfo[0]?.map(price => safeFormatEther(price)) || ["0", "0", "0", "0"],
        tierShares: tierInfo[1]?.map(shares => Number(shares || 0)) || [0, 0, 0, 0],
        fundingPercentage
      };
    } catch (error) {
      console.error(`Detailed error fetching project ${projectId}:`, error);
      throw error; // Re-throw to be handled by the caller
    }
  };

  const createFallbackProject = (id) => {
    const fallbacks = [
      {
        id: 1,
        creator: "0x57e3a864344854898E3B982bC42fe7207423a8d0",
        title: "Lost in Translation",
        description: "A story of the african child",
        coverImageURI: "https://ipfs.io/ipfs/bafybeih32i6w2pe422wtnutllevjaeg7sough67kbtnfd6vgklwrgx36rm",
        fundingGoal: "1",
        currentFunding: "0",
        streamingRevenue: "0",
        totalShares: 1000,
        remainingShares: 1000,
        status: "Funding",
        statusCode: 0,
        createdAt: new Date(1746477600 * 1000),
        tierPricing: ["0.1", "0.2", "0.3", "0.5"],
        tierShares: [10, 25, 50, 100],
        fundingPercentage: 0
      },
      {
        id: 2,
        creator: "0x57e3a864344854898E3B982bC42fe7207423a8d0",
        title: "Urban Legends",
        description: "Uncovering the hidden truths of the African tribes",
        coverImageURI: "https://ipfs.io/ipfs/bafybeiclzz5idqkeo6ire3fpat4wu22j5kvvbdd3h5m6uukp4fpzzj5rpu",
        fundingGoal: "39.9",
        currentFunding: "0",
        streamingRevenue: "0",
        totalShares: 1000,
        remainingShares: 1000,
        status: "Funding",
        statusCode: 0,
        createdAt: new Date(1746618112 * 1000),
        tierPricing: ["0.1", "0.2", "0.3", "0.5"],
        tierShares: [10, 25, 50, 100],
        fundingPercentage: 0
      }
    ];
    
    return fallbacks.find(p => p.id === id) || fallbacks[0];
  };

  function applyFilters(projectsToFilter) {
    let filteredProjects = [...projectsToFilter];
    
    if (filterType === 'creator' && address) {
      filteredProjects = filteredProjects.filter(p => 
        p.creator.toLowerCase() === address.toLowerCase()
      );
    } else if (filterType === 'funding') {
      filteredProjects = filteredProjects.filter(p => p.statusCode === 0);
    } else if (filterType === 'streaming') {
      filteredProjects = filteredProjects.filter(p => p.statusCode === 2);
    }
    
    // Sort by newest first
    filteredProjects.sort((a, b) => b.createdAt - a.createdAt);
    
    setProjects(filteredProjects);
  }

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refreshProjects: fetchProjects };
};