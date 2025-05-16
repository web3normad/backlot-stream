"use client"
import { useState, useEffect } from "react";
import {
  Film,
  BarChart2,
  DollarSign,
  Clock,
  Edit,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useProjects } from "../../hooks/useProjects";
import { useAccount } from "wagmi"; // Assuming you're using wagmi for wallet connection

export default function CreatorDashboard() {
  const { address } = useAccount();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Fetch projects created by the current user
  const { 
    projects, 
    loading, 
    error, 
    refreshProjects 
  } = useProjects('creator', address, refreshTrigger);

  // Calculate stats based on real data
  const calculateStats = () => {
    if (!projects || projects.length === 0) {
      return [
        {
          name: "Total Raised",
          value: "$0",
          icon: DollarSign,
          change: "+$0",
          changeType: "neutral",
        },
        {
          name: "Active Projects",
          value: "0",
          icon: Film,
          change: "0",
          changeType: "neutral",
        },
        {
          name: "Total Investors",
          value: "0",
          icon: Users,
          change: "0",
          changeType: "neutral",
        },
        {
          name: "Avg. Funding",
          value: "0%",
          icon: BarChart2,
          change: "0%",
          changeType: "neutral",
        }
      ];
    }

    // Calculate total ETH raised (sum of currentFunding across all projects)
    const totalRaised = projects.reduce((sum, project) => 
      parseFloat(project.currentFunding) + sum, 0);
    
    // Count projects in funding status (status code 0) 
    const activeProjects = projects.filter(p => p.statusCode === 0).length;
    
    // Calculate average funding percentage
    const avgFunding = projects.length > 0 
      ? projects.reduce((sum, project) => project.fundingPercentage + sum, 0) / projects.length
      : 0;
    
    // For investor count, we don't have actual data, so we'll approximate
    // In a real app, you would track this data separately
    const estimatedInvestors = Math.round(totalRaised * 5); // Just a placeholder estimation
    
    return [
      {
        name: "Total Raised",
        value: `${totalRaised.toFixed(2)} ETH`,
        icon: DollarSign,
        change: `+${(totalRaised * 0.1).toFixed(2)} ETH`, // Assuming 10% growth
        changeType: "positive",
      },
      {
        name: "Active Projects",
        value: activeProjects.toString(),
        icon: Film,
        change: "+1", // Placeholder
        changeType: "positive",
      },
      {
        name: "Total Investors",
        value: estimatedInvestors.toString(),
        icon: Users,
        change: "+5", // Placeholder
        changeType: "positive",
      },
      {
        name: "Avg. Funding",
        value: `${Math.round(avgFunding)}%`,
        icon: BarChart2,
        change: "+2%", // Placeholder
        changeType: "positive",
      },
    ];
  };

  // Generate milestones from real project data
  const generateMilestones = () => {
    if (!projects || projects.length === 0) {
      return [];
    }

    const milestones = [];
    const currentDate = new Date();
    
    // Add milestones based on funding status
    projects.forEach(project => {
      if (project.statusCode === 0) { // Funding
        // Set a milestone 15 days from now for funding completion
        const dueDate = new Date();
        dueDate.setDate(currentDate.getDate() + 15);
        
        milestones.push({
          id: `${project.id}-funding`,
          project: project.title,
          task: "Complete Funding",
          due: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: "In Progress"
        });
      } else if (project.statusCode === 1) { // Production
        const dueDate = new Date();
        dueDate.setDate(currentDate.getDate() + 30);
        
        milestones.push({
          id: `${project.id}-production`,
          project: project.title,
          task: "Complete Production",
          due: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: "In Progress"
        });
      } else if (project.statusCode === 2) { // Streaming
        const dueDate = new Date();
        dueDate.setDate(currentDate.getDate() + 7);
        
        milestones.push({
          id: `${project.id}-marketing`,
          project: project.title,
          task: "Marketing Campaign",
          due: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: "Upcoming"
        });
      }
    });
    
    // Sort by due date and take only the first 3
    return milestones
      .sort((a, b) => new Date(a.due) - new Date(b.due))
      .slice(0, 3);
  };

  const stats = calculateStats();
  const milestones = generateMilestones();

  // Refresh data when component mounts or address changes
  useEffect(() => {
    if (address) {
      refreshProjects();
    }
  }, [address, refreshProjects]);

  // Handler to manually refresh data
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-20 w-80 h-80 bg-cyan-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Film className="text-blue-500" size={32} />
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
            BacklotFlix
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/projects" className="text-gray-300 hover:text-white">
            Projects
          </Link>
          <Link href="/dashboard" className="text-white">
            Dashboard
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Creator Dashboard
            </h1>
            <p className="text-gray-300">
              Manage your film projects and funding
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <Link href="/streaming">
              <button className="px-4 py-2 bg-gray-800/60 rounded-lg border border-gray-700 text-gray-300 hover:text-white transition-colors flex items-center">
                <Film className="h-5 w-5 mr-2" />
                Streaming
              </button>
            </Link>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-800/60 rounded-lg border border-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              Refresh Data
            </button>
            <Link href="/projects/new">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                New Project
              </button>
            </Link>
            <Link href="/streaming/upload">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Movie
              </button>
            </Link>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, statIdx) => (
              <div
                key={statIdx}
                className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">{stat.name}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      stat.changeType === "positive"
                        ? "bg-green-500/20"
                        : stat.changeType === "negative"
                        ? "bg-red-500/20"
                        : "bg-gray-500/20"
                    }`}
                  >
                    <stat.icon
                      className={`h-6 w-6 ${
                        stat.changeType === "positive"
                          ? "text-green-400"
                          : stat.changeType === "negative"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
                <p
                  className={`text-sm mt-3 ${
                    stat.changeType === "positive"
                      ? "text-green-400"
                      : stat.changeType === "negative"
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Your Projects */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Projects</h2>
                <Link href="/projects?filter=creator">
                  <button className="text-sm text-blue-400 hover:text-blue-300">
                    View All
                  </button>
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 text-center">
                  <Film className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-300">No projects yet</h3>
                  <p className="text-gray-400 mt-1 mb-4">Create your first film project to get started</p>
                  <Link href="/projects/new">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Create New Project
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 h-14 w-14 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            {project.coverImageURI ? (
                              <img 
                                src={project.coverImageURI} 
                                alt={project.title}
                                className="h-14 w-14 object-cover rounded-lg"
                              />
                            ) : (
                              <Film className="h-6 w-6 text-blue-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white">
                              {project.title}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  project.status === "Funding"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : project.status === "Production"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >
                                {project.status}
                              </span>
                              <span className="text-xs text-gray-400 flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />{" "}
                                {project.currentFundingFormatted}
                              </span>
                              {project.statusCode === 0 && (
                                <span className="text-xs text-gray-400 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />{" "}
                                  15 days left {/* This would ideally come from contract */}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="md:w-1/3">
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: `${project.fundingPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{project.fundingPercentage}% funded</span>
                            <Link
                              href={`/projects/${project.id}`}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Manage
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Upload */}
              <div className="mt-8 bg-gradient-to-br from-blue-900/40 to-cyan-900/20 rounded-xl p-6 border border-blue-500/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Share Project Updates
                    </h3>
                    <p className="text-sm text-gray-300">
                      Keep your investors engaged with regular updates
                    </p>
                  </div>
                  <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium transition-all">
                    <Upload className="h-5 w-5" />
                    <span>Upload Media</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upcoming Milestones</h2>
                <button className="text-sm text-blue-400 hover:text-blue-300">
                  View All
                </button>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                {milestones.length === 0 ? (
                  <div className="text-center py-6">
                    <Clock className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No upcoming milestones</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-700/50">
                    {milestones.map((milestone) => (
                      <li key={milestone.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">
                              {milestone.task}
                            </p>
                            <p className="text-xs text-gray-400">
                              {milestone.project}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                milestone.status === "In Progress"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : milestone.status === "Pending"
                                  ? "bg-gray-500/20 text-gray-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {milestone.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              {milestone.due}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700/40 hover:bg-gray-700 rounded-lg transition-colors">
                  <Edit className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-400">Add Milestone</span>
                </button>
              </div>

              {/* Investor Messages */}
              <div className="mt-8 bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                <h3 className="font-bold text-lg mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700/40 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="font-medium">Investor Group</span>
                      <span className="text-xs text-gray-400 ml-auto">
                        2h ago
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {projects.length > 0 
                        ? `Hi there! We're excited about the progress on "${projects[0].title}". Could you share some updates on the casting process?`
                        : "Hi there! When will you start your first film project? We're excited to invest!"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-700/40 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="font-medium">Sarah Johnson</span>
                      <span className="text-xs text-gray-400 ml-auto">
                        1d ago
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      Loved the latest production stills! When can we expect the first trailer?
                    </p>
                  </div>
                </div>

                <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700/40 hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-blue-400">View All Messages</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}