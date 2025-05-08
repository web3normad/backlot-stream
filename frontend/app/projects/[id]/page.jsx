"use client"
import { Film, Star, TrendingUp, Clock, Users, Heart, Share2 } from 'lucide-react';
import ProjectCard from '../../components/ProjectCard';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useProjectDetails } from '../../hooks/useProjectDetails';
import { useProjects } from '../../hooks/useProjects';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatEth } from '../../utils/contract';
import { createWalletClientInstance, ensureCorrectNetwork } from '../../utils/contract';
import { parseEther } from 'viem';
import { getContractConfig } from '../../utils/contract';

export default function ProjectDetailsPage({ params }) {
  const projectId = params?.id;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { project, loading, error, refreshProject } = useProjectDetails(projectId);
  const { projects: similarProjects } = useProjects('all');
  
  // Investment states
  const [selectedTier, setSelectedTier] = useState(null);
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentError, setInvestmentError] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log("Project details:", {
      id: project?.id,
      title: project?.title,
      description: project?.description,
      coverImageURI: project?.coverImageURI,
      fundingGoal: project?.fundingGoal,
      currentFunding: project?.currentFunding,
      tierPricing: project?.tierPricing,
      tierShares: project?.tierShares
    });
  }, [project]);

  // Handle IPFS image URLs with simplified fallback strategy

const getImageUrl = (uri) => {
  if (!uri) return '/placeholder-image.jpg';
  
  // If already a HTTP URL, return as-is
  if (uri.startsWith('http')) {
    return uri;
  }
  
  // Handle IPFS URIs (ipfs://)
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    // Try multiple gateways for reliability
    return `https://ipfs.io/ipfs/${cid}`;
   
  }
  
  // Handle raw IPFS hashes (Qm... or bafy...)
  if (uri.startsWith('Qm') || uri.startsWith('bafy')) {
    return `https://ipfs.io/ipfs/${uri}`;
  }
  
  // Default fallback
  return '/placeholder-image.jpg';
};

  const coverImageUrl = getImageUrl(project?.coverImageURI);

  // Reset image loading state when project or URL changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [project?.coverImageURI]);

  // Calculate progress with safety checks
  const progressPercentage = project?.fundingGoal && parseFloat(project.fundingGoal) > 0
    ? Math.min(Math.round((parseFloat(project.currentFunding || 0) / parseFloat(project.fundingGoal) * 100)), 100)
    : 0;

  // Filter similar projects (excluding current project)
  const filteredSimilarProjects = similarProjects
    ?.filter(p => p.id !== project?.id)
    ?.slice(0, 2) || [];

  // Calculate days left (30 days from creation)
  const daysLeft = project?.statusCode === 0 && project?.createdAt
    ? Math.max(0, Math.ceil((new Date(project.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
    
  // Function to invest in project
  const investInProject = async () => {
    if (!selectedTier && selectedTier !== 0) {
      setInvestmentError("Please select an investment tier");
      return;
    }
    
    try {
      setIsInvesting(true);
      setInvestmentError(null);
      
      // Ensure connected to correct network
      await ensureCorrectNetwork();
      
      // Get wallet client
      const walletClient = await createWalletClientInstance();
      
      // Get contract config
      const { address: contractAddress, abi } = getContractConfig();
      
      // Get investment amount based on selected tier
      const tierPricing = project?.tierPricing || [0.1, 0.2, 0.3, 0.5];
      const investmentAmount = tierPricing[selectedTier]?.toString() || "0.1";
      
      console.log("Investing:", {
        projectId, 
        tier: selectedTier, 
        amount: investmentAmount
      });
      
      // Call contract's investInProject function
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi,
        functionName: 'investInProject',
        args: [BigInt(projectId), selectedTier],
        value: parseEther(investmentAmount),
      });
      
      setTransactionHash(hash);
      console.log("Transaction submitted:", hash);
      
      // Show success message
      setInvestmentSuccess(true);
      
      // Refresh project data after a short delay
      setTimeout(() => {
        refreshProject();
      }, 2000);
      
    } catch (error) {
      console.error('Investment error:', error);
      setInvestmentError(error.message || 'Failed to invest in project');
    } finally {
      setIsInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <NavBar />
        <div className="flex justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <NavBar />
        <div className="text-center py-32">
          <p className="text-red-400 text-lg">Invalid project ID</p>
          <Link href="/projects" className="mt-4 inline-block px-6 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
            Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <NavBar />
        <div className="text-center py-32">
          <p className="text-red-400 text-lg">{error || 'Project not found'}</p>
          <Link href="/projects" className="mt-4 inline-block px-6 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
            Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Get tier data for display
  const tierData = (!project?.tierPricing || project.tierPricing.length === 0) ? 
    [
      { price: "0.1", shares: 10, name: "Bronze" },
      { price: "0.2", shares: 25, name: "Silver" },
      { price: "0.3", shares: 50, name: "Gold" },
      { price: "0.5", shares: 100, name: "Platinum" }
    ] : 
    project.tierPricing.map((price, index) => ({
      price: price.toString(),
      shares: project.tierShares?.[index] || 0,
      name: index === 0 ? "Bronze" : index === 1 ? "Silver" : index === 2 ? "Gold" : "Platinum"
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>
      
      <NavBar />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Investment success notification */}
        {investmentSuccess && (
          <div className="mb-6 bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">Investment successful!</p>
              <p className="text-sm">Your investment has been processed. Thank you for supporting this project!</p>
              {transactionHash && (
                <a 
                  href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm underline"
                >
                  View transaction
                </a>
              )}
            </div>
            <button onClick={() => setInvestmentSuccess(false)} className="text-green-100">
              ✕
            </button>
          </div>
        )}
        
        {/* Investment error notification */}
        {investmentError && (
          <div className="mb-6 bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">Investment failed</p>
              <p className="text-sm">{investmentError}</p>
            </div>
            <button onClick={() => setInvestmentError(null)} className="text-red-100">
              ✕
            </button>
          </div>
        )}
        
        {/* Project Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="lg:w-2/3">
            <div className="relative rounded-xl overflow-hidden border border-pink-500/30 h-96">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                </div>
              )}
              <img 
                src={coverImageUrl}
                alt={project?.title || "Project Image"}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  console.error("Image failed to load:", coverImageUrl);
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = '/placeholder-image.jpg';
                  setImageLoading(false);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {project?.status || "Funding"}
                </span>
              </div>
              {project?.statusCode === 0 && daysLeft > 0 && (
                <div className="absolute top-4 right-4 bg-gray-900/80 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center">
                  <Clock size={14} className="mr-1" /> 
                  {daysLeft} days left
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 h-full">
              <h1 className="text-3xl font-bold mb-2">{project?.title || "Lost in Translation"}</h1>
              <p className="text-gray-300 mb-6">{project?.description || "A story of the african child"}</p>
              
              <div className="flex items-center text-gray-300 text-sm mb-6">
                <Star size={16} className="text-yellow-500 mr-1" />
                <span className="mr-3">Created by {project?.creator ? `${project.creator.slice(0, 6)}...${project.creator.slice(-4)}` : "Anonymous"}</span>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{project?.currentFunding || "0"} ETH raised</span>
                  <span className="text-gray-300">{project?.fundingGoal || "1"} ETH goal</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-300">
                  <span className="text-white font-medium">{progressPercentage}%</span> funded
                </div>
              </div>
              
              <button 
                className={`w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg font-medium text-white transition-all mb-4 ${isInvesting ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={investInProject}
                disabled={isInvesting || !selectedTier && selectedTier !== 0 || project?.statusCode !== 0}
              >
                {isInvesting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : project?.statusCode !== 0 ? 
                  "Funding Closed" : 
                  selectedTier !== null ? 
                  `Invest ${tierData[selectedTier]?.price || "0.1"} ETH` : 
                  "Select a Tier Below"}
              </button>
              
              <div className="flex space-x-3">
                <button className="flex-1 py-2 bg-gray-700/40 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <Heart size={18} className="mr-2" /> Save
                </button>
                <button className="flex-1 py-2 bg-gray-700/40 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <Share2 size={18} className="mr-2" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 mb-8">
              <h2 className="text-2xl font-bold mb-4">Storyline</h2>
              <p className="text-gray-300">{project?.description || "A story of the african child"}</p>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
              <h2 className="text-2xl font-bold mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <h3 className="font-medium">Total Shares</h3>
                  <p className="text-sm text-gray-400">{project?.totalShares || 1000}</p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <h3 className="font-medium">Shares Available</h3>
                  <p className="text-sm text-gray-400">{project?.remainingShares || 1000}</p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <h3 className="font-medium">Project Status</h3>
                  <p className="text-sm text-gray-400">{project?.status || "Funding"}</p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <h3 className="font-medium">Created On</h3>
                  <p className="text-sm text-gray-400">
                    {project?.createdAt ? 
                      new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 
                      "Unknown date"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Investment Tiers</h2>
              <div className="space-y-4">
                {tierData.map((tier, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                      selectedTier === index 
                        ? 'border-pink-500 bg-pink-500/10' 
                        : 'border-pink-500/30 hover:border-pink-500/60'
                    }`}
                    onClick={() => setSelectedTier(index)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{tier.price} ETH</h3>
                      <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full">
                        {tier.shares} shares
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {tier.name} Tier - {index === 0 ? "Basic" : index === 1 ? "Enhanced" : index === 2 ? "Premium" : "VIP"} rewards
                    </p>
                    {selectedTier === index && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-pink-400 text-xs">Selected</span>
                        <button 
                          className="text-xs bg-pink-500 hover:bg-pink-600 px-2 py-1 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            investInProject();
                          }}
                          disabled={isInvesting}
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Help text */}
              <div className="mt-4 text-xs text-gray-400">
                <p>Select a tier above, then click "Invest" to complete your investment via MetaMask.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Projects */}
        {filteredSimilarProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Similar Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSimilarProjects.map(similarProject => (
                <ProjectCard key={similarProject.id} project={similarProject} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}