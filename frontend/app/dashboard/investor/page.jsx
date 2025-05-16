"use client"

import { useState, useEffect } from 'react';
import { Film, Star, BarChart2, DollarSign, Award, Users, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useInvestorData } from '../../hooks/useInvestorData';
import { useProjects } from '../../hooks/useProjects'; // Import the useProjects hook
import { formatProjectStatus } from '../../utils/contract';
import { ensureCorrectNetwork } from '../../utils/contract';

export default function InvestorDashboard() {
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  
  // Fetch investor data using the hook
  const { investments, loading, error, refreshInvestorData } = useInvestorData(address);
  
  // Fetch recommended projects using useProjects hook - filtering for funding projects
  const { projects: recommendedProjects, loading: projectsLoading } = useProjects('funding');
  
  // Stats derived from actual investment data
  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
  const activeProjects = investments.filter(inv => inv.projectStatus < 3).length; 
  const avgRoi = investments.length > 0 ? investments.reduce((sum, inv) => sum + (inv.projectStatus >= 2 ? 8.5 : 0), 0) / investments.length : 0;
  
  // Connect wallet function
  const connectWallet = async () => {
    setConnecting(true);
    setNetworkError(null);
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it to use this app.");
      }
      
      // Ensure correct network
      await ensureCorrectNetwork();
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      
      // Set up event listener for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        setAddress(accounts[0] || null);
      });
      
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setNetworkError(error.message);
    } finally {
      setConnecting(false);
    }
  };

  // Connect to wallet on initial load if ethereum is available
  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setAddress(window.ethereum.selectedAddress);
      
      // Set up event listener for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        setAddress(accounts[0] || null);
      });
    }
  }, []);
  
  // Stats based on actual data + some static elements
  const stats = [
    { name: 'Total Invested', value: `$${totalInvested.toFixed(2)}`, icon: DollarSign, change: '+24%', changeType: 'positive' },
    { name: 'Active Projects', value: `${activeProjects}`, icon: Film, change: '+1', changeType: 'positive' },
    { name: 'Avg. ROI', value: `${avgRoi.toFixed(1)}%`, icon: BarChart2, change: '+1.2%', changeType: 'positive' },
    { name: 'Investor Rank', value: 'Gold', icon: Award, change: '↑ 2', changeType: 'positive' },
  ];

  // Format address for display
  const shortenedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-pulse"></div>
      </div>
      
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Film className="text-pink-500" size={32} />
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">BacklotFlix</Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/projects" className="text-gray-300 hover:text-white">Projects</Link>
          <Link href="/dashboard" className="text-white">Dashboard</Link>
          <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
          {address ? (
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
              {shortenedAddress}
            </button>
          ) : (
            <button 
              onClick={connectWallet} 
              disabled={connecting}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
            >
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </button>
          )}
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Investor Dashboard</h1>
            <p className="text-gray-300">Welcome back! Here's your investment overview</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-800/60 rounded-lg border border-gray-700 text-gray-300 hover:text-white transition-colors">
              Export Report
            </button>
            <Link href="/projects">
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Invest Now
              </button>
            </Link>
          </div>
        </div>
        
        {networkError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-white flex items-center">
            <Info className="h-5 w-5 mr-2 text-red-400" />
            <p>{networkError}</p>
          </div>
        )}
        
        {!address ? (
          <div className="text-center p-10 bg-gray-800/60 backdrop-blur-sm rounded-xl mb-10 border border-pink-500/20">
            <Film className="h-16 w-16 mx-auto text-pink-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">Connect your wallet to view your investments and track your portfolio performance.</p>
            <button 
              onClick={connectWallet}
              disabled={connecting}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center mx-auto"
            >
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </button>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, statIdx) => (
                <div key={statIdx} className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300">{stat.name}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.changeType === 'positive' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      <stat.icon className={`h-6 w-6 ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                  </div>
                  <p className={`text-sm mt-3 ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Investments */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Your Investments</h2>
                  <button onClick={refreshInvestorData} className="text-sm text-pink-400 hover:text-pink-300">Refresh</button>
                </div>
                
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-pink-500/20">
                  {loading ? (
                    <div className="flex justify-center items-center p-10">
                      <Loader2 className="h-8 w-8 text-pink-500 animate-spin mr-3" />
                      <p>Loading your investments...</p>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center p-10 text-red-400">
                      <Info className="h-6 w-6 mr-2" />
                      <p>{error}</p>
                    </div>
                  ) : investments.length === 0 ? (
                    <div className="flex flex-col justify-center items-center p-10">
                      <Film className="h-12 w-12 text-gray-500 mb-4" />
                      <p className="text-lg font-medium mb-2">No investments found</p>
                      <p className="text-gray-400 text-center">Explore new projects and start building your portfolio.</p>
                      <Link href="/projects">
                        <button className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                          Browse Projects
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700/50">
                        <thead className="bg-gray-700/40">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ROI</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                          {investments.map((investment) => (
                            <tr key={investment.tokenId} className="hover:bg-gray-700/30 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                                    <Film className="h-5 w-5 text-pink-400" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{investment.projectTitle}</div>
                                    <div className="text-xs text-gray-400 flex items-center">
                                      <span className="bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded text-xs mr-2">
                                        {investment.tier}
                                      </span>
                                      <span>#{investment.tokenId}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">{investment.amount} ETH</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm ${investment.projectStatus >= 2 ? 'text-green-400' : 'text-gray-400'}`}>
                                  {investment.projectStatus >= 2 ? '+8.5%' : 'Pending'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full 
                                  ${investment.projectStatus === 0 ? 'bg-amber-500/20 text-amber-400' : 
                                    investment.projectStatus === 1 ? 'bg-blue-500/20 text-blue-400' :
                                    investment.projectStatus === 2 ? 'bg-green-500/20 text-green-400' :
                                    investment.projectStatus === 3 ? 'bg-purple-500/20 text-purple-400' :
                                    'bg-red-500/20 text-red-400'}`}>
                                  {formatProjectStatus(investment.projectStatus)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/projects/${investment.projectId}`} className="text-pink-400 hover:text-pink-300">
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recommended Projects - Now using real data */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Recommended</h2>
                  <Link href="/projects" className="text-sm text-pink-400 hover:text-pink-300">See More</Link>
                </div>
                
                <div className="space-y-4">
                  {projectsLoading ? (
                    <div className="flex justify-center items-center p-10 bg-gray-800/60 backdrop-blur-sm rounded-xl">
                      <Loader2 className="h-8 w-8 text-pink-500 animate-spin mr-3" />
                      <p>Loading recommendations...</p>
                    </div>
                  ) : recommendedProjects.length === 0 ? (
                    <div className="flex flex-col justify-center items-center p-10 bg-gray-800/60 backdrop-blur-sm rounded-xl">
                      <Film className="h-12 w-12 text-gray-500 mb-4" />
                      <p className="text-lg font-medium mb-2">No projects found</p>
                      <p className="text-gray-400 text-center">Check back later for new investment opportunities.</p>
                    </div>
                  ) : (
                    // Display up to 3 recommended projects
                    recommendedProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-12 w-12 bg-pink-500/20 rounded-lg flex items-center justify-center mr-4">
                            <Film className="h-5 w-5 text-pink-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white">{project.title}</h3>
                            <p className="text-xs text-gray-400 mb-2">ID: {project.id}</p>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                              <div 
                                className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full" 
                                style={{ width: `${project.fundingPercentage}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>{project.fundingPercentage}% funded</span>
                              <span>{project.fundingGoalFormatted} goal</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Link href={`/projects/${project.id}`} className="flex-1">
                            <button className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-sm font-medium text-white transition-all">
                              Invest
                            </button>
                          </Link>
                          <button className="px-3 py-2 bg-gray-700/40 hover:bg-gray-700 rounded-lg transition-all">
                            <Star className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Quick Actions */}
                <div className="mt-8 bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
                  <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/40 hover:bg-gray-700 rounded-lg transition-colors">
                      <span className="text-gray-300">Withdraw Earnings</span>
                      <DollarSign className="h-5 w-5 text-pink-400" />
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/40 hover:bg-gray-700 rounded-lg transition-colors">
                      <span className="text-gray-300">View Portfolio</span>
                      <BarChart2 className="h-5 w-5 text-pink-400" />
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/40 hover:bg-gray-700 rounded-lg transition-colors">
                      <span className="text-gray-300">Invite Friends</span>
                      <Users className="h-5 w-5 text-pink-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}