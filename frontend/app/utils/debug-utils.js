// debug-utils.js
import { getPublicClient, CONTRACT_ADDRESS, CONTRACT_ABI } from './contract';

// Debugging function to check contract state
export async function debugContractState() {
  console.log("=== Contract Debug Start ===");
  
  try {
    const publicClient = getPublicClient();
    
    // Check projects count
    const count = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'projectsCount',
    });
    
    console.log(`Projects count from contract: ${count}`);
    
    // Try to read each project
    if (count > 0) {
      console.log("Attempting to read all projects...");
      
      for (let i = 1; i <= Number(count); i++) {
        try {
          const projectDetails = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'projects',
            args: [BigInt(i)],
          });
          
          console.log(`Project ${i}:`, {
            id: Number(projectDetails.id),
            creator: projectDetails.creator,
            title: projectDetails.title,
            status: Number(projectDetails.status),
            currentFunding: projectDetails.currentFunding.toString(),
          });
          
          // Check if project has tier info
          try {
            const tierInfo = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: 'getProjectTierInfo',
              args: [BigInt(i)],
            });
            
            console.log(`Project ${i} tier info:`, {
              tierPricing: tierInfo[0].map(p => p.toString()),
              tierShares: tierInfo[1].map(s => s.toString())
            });
          } catch (tierError) {
            console.error(`Error fetching tier info for project ${i}:`, tierError);
          }
        } catch (projectError) {
          console.error(`Error fetching project ${i}:`, projectError);
        }
      }
    }
    
    // Check for ProjectCreated events
    console.log("Checking for ProjectCreated events...");
    const events = await publicClient.getContractEvents({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      eventName: 'ProjectCreated',
      fromBlock: 'earliest',
    });
    
    console.log(`Found ${events.length} ProjectCreated events`);
    events.forEach((event, index) => {
      console.log(`Event ${index + 1}:`, {
        projectId: event.args?.projectId ? Number(event.args.projectId) : "unknown",
        creator: event.args?.creator || "unknown",
        title: event.args?.title || "unknown"
      });
    });
    
    return {
      success: true,
      projectCount: Number(count),
      eventsCount: events.length
    };
  } catch (error) {
    console.error("Contract debugging error:", error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    console.log("=== Contract Debug End ===");
  }
}

// utils/debug-utils.js
export const debugProjectFetching = async (projectId) => {
  try {
    const publicClient = getPublicClient();
    const { address: contractAddress, abi } = getContractConfig();
    
    // 1. Check projects count
    const count = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: 'projectsCount',
    });
    
    // 2. Get raw project data
    const projectDetails = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: 'projects',
      args: [BigInt(projectId)],
    });
    
    // 3. Get tier info
    const tierInfo = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: 'getProjectTierInfo',
      args: [BigInt(projectId)],
    });
    
    return {
      projectsCount: Number(count),
      projectDetails,
      tierInfo,
      isValidProject: (
        projectDetails && 
        projectDetails.creator !== '0x0000000000000000000000000000000000000000' &&
        projectDetails.title
      )
    };
  } catch (error) {
    return { error: error.message };
  }
};

// Function to test project filtering
export async function testProjectFiltering(projects) {
  console.log("=== Filter Debug Start ===");
  console.log(`Total projects before filtering: ${projects.length}`);
  
  // Test filtering by different criteria
  const fundingProjects = projects.filter(p => p && p.statusCode === 0);
  console.log(`Funding projects: ${fundingProjects.length}`);
  
  const streamingProjects = projects.filter(p => p && p.statusCode === 2);
  console.log(`Streaming projects: ${streamingProjects.length}`);
  
  // Check for null/undefined projects
  const nullProjects = projects.filter(p => p === null || p === undefined);
  console.log(`Null/undefined projects: ${nullProjects.length}`);
  
  console.log("=== Filter Debug End ===");
}

// Function to help with force refreshing
export function forceProjectRefresh() {
  // Clear any project cache
  window.localStorage.removeItem('project_cache');
  
  // Update URL to force refresh
  const url = new URL(window.location.href);
  url.searchParams.set('refresh', 'true');
  url.searchParams.set('timestamp', Date.now());  // Add timestamp to prevent caching
  window.location.href = url.toString();
}