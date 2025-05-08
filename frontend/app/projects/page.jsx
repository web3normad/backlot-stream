"use client"
import { useState } from 'react';
import { Film, Star, TrendingUp, Search, Filter, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import ProjectCard from '../components/ProjectCard';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useProjects } from '../hooks/useProjects';
import { useAccount } from 'wagmi';

export default function ProjectsExplorationPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { address } = useAccount();
  
  // Fetch projects based on active tab
  const { projects, loading, error } = useProjects(
    activeTab === 'my' ? 'creator' : 'all',
    activeTab === 'my' ? address : null
  );

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      
      <div className="relative z-10 px-6 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Film Projects</h1>
            <p className="text-gray-300">Invest in the next generation of independent filmmaking</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search size={18} className="absolute top-2.5 left-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="pl-10 pr-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 bg-gray-800/60 rounded-lg border border-gray-700">
              <Filter size={20} className="text-gray-300" />
            </button>
          </div>
        </div>
        
        {/* Tabs & View Toggle */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex space-x-1 bg-gray-800/40 p-1 rounded-lg border border-gray-700/50">
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'all' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setActiveTab('all')}
            >
              All Projects
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'my' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setActiveTab('my')}
              disabled={!address}
            >
              My Investments
            </button>
          </div>
          
          <div className="flex space-x-1 bg-gray-800/40 p-1 rounded-lg border border-gray-700/50">
            <button 
              className={`px-3 py-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-700' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={`px-3 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-700' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>
        
        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {/* Projects Grid/List */}
        {!loading && !error && (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} variant="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} variant="list" />
              ))}
            </div>
          )
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-gray-800/20 rounded-xl">
            <p className="text-gray-400 text-lg">
              {activeTab === 'my' 
                ? 'You have not invested in any projects yet'
                : 'No projects found matching your criteria'}
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}