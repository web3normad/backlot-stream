// components/ProjectCard.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { shortenAddress } from '../utils/contract';

export default function ProjectCard({ project, variant = 'grid' }) {
  // Format currency values properly with enhanced error handling
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0 ETH';
    
    try {
      // Convert string to number and format
      const valueInEth = parseFloat(value);
      if (isNaN(valueInEth)) return '0 ETH';
      return `${valueInEth.toFixed(4)} ETH`;
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '0 ETH';
    }
  };

  // Convert IPFS URL to HTTPS gateway URL if needed
  const getImageUrl = (uri) => {
    if (!uri) return '/api/placeholder/400/225';
    
    // If already using https, return as is
    if (uri.startsWith('http')) {
      return uri;
    }
    
    // Convert IPFS URL to gateway URL
    if (uri.startsWith('ipfs://')) {
      const ipfsHash = uri.replace('ipfs://', '');
      return `https://ipfs.io/ipfs/${ipfsHash}`;
    }
    
    // Return original if no conversion needed
    return uri;
  };

  // Fallback for project values
  const safeProject = {
    id: project?.id || 0,
    title: project?.title || "Unnamed Project",
    description: project?.description || "No description available.",
    coverImageURI: project?.coverImageURI || "",
    fundingGoal: project?.fundingGoal || "0",
    currentFunding: project?.currentFunding || "0",
    streamingRevenue: project?.streamingRevenue || "0",
    totalShares: project?.totalShares || 0,
    remainingShares: project?.remainingShares || 0,
    status: project?.status || "Unknown",
    statusCode: project?.statusCode || 0,
    createdAt: project?.createdAt || new Date(),
    fundingPercentage: project?.fundingPercentage || 0,
    creator: project?.creator || "0x0000000000000000000000000000000000000000"
  };

  const imageUrl = getImageUrl(safeProject.coverImageURI);

  if (variant === 'grid') {
    return (
      <div className="group relative bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium uppercase
            ${safeProject.status === 'Funding' ? 'bg-blue-500/80' : ''}
            ${safeProject.status === 'Production' ? 'bg-yellow-500/80' : ''}
            ${safeProject.status === 'Streaming' ? 'bg-green-500/80' : ''}
            ${safeProject.status === 'Completed' ? 'bg-purple-500/80' : ''}
            ${safeProject.status === 'Cancelled' ? 'bg-red-500/80' : ''}
            ${safeProject.status === 'Unknown' ? 'bg-gray-500/80' : ''}
          `}>
            {safeProject.status}
          </span>
        </div>
        
        {/* Image */}
        <div className="aspect-video relative overflow-hidden">
          <div className="relative w-full h-full">
            <img 
              src={imageUrl}
              alt={safeProject.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/api/placeholder/400/225';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 text-white">{safeProject.title}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {safeProject.description}
          </p>
          
          {/* Stats */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Funding Goal:</span>
              <span className="font-medium text-white">{formatCurrency(safeProject.fundingGoal)}</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full" 
                style={{ width: `${Math.min(Math.max(safeProject.fundingPercentage, 0), 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {formatCurrency(safeProject.currentFunding)} raised 
                ({Math.round(safeProject.fundingPercentage || 0)}%)
              </span>
              <span className="text-gray-400">
                {safeProject.remainingShares}/{safeProject.totalShares} shares
              </span>
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center text-gray-400 text-xs">
              <Clock size={14} className="mr-1" />
              {safeProject.createdAt ? 
                formatDistanceToNow(new Date(safeProject.createdAt), { addSuffix: true }) : 
                'Unknown date'}
            </div>
            <div className="text-xs text-gray-400">
              By {shortenAddress(safeProject.creator)}
            </div>
          </div>
        </div>
        
        {/* Action button */}
        <Link href={`/projects/${safeProject.id}`} className="absolute inset-0" aria-label={`View ${safeProject.title}`}>
          <span className="sr-only">View project</span>
        </Link>
      </div>
    );
  } else {
    // List variant
    return (
      <div className="group flex flex-col md:flex-row bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
        {/* Image */}
        <div className="md:w-1/4 aspect-video md:aspect-square relative overflow-hidden">
          <img 
            src={imageUrl}
            alt={safeProject.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = '/api/placeholder/400/400';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70 md:bg-gradient-to-r"></div>
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className={`
              px-3 py-1 rounded-full text-xs font-medium uppercase
              ${safeProject.status === 'Funding' ? 'bg-blue-500/80' : ''}
              ${safeProject.status === 'Production' ? 'bg-yellow-500/80' : ''}
              ${safeProject.status === 'Streaming' ? 'bg-green-500/80' : ''}
              ${safeProject.status === 'Completed' ? 'bg-purple-500/80' : ''}
              ${safeProject.status === 'Cancelled' ? 'bg-red-500/80' : ''}
              ${safeProject.status === 'Unknown' ? 'bg-gray-500/80' : ''}
            `}>
              {safeProject.status}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="md:w-3/4 p-5 relative">
          <h3 className="text-xl font-bold mb-2 text-white">{safeProject.title}</h3>
          <p className="text-gray-300 text-sm mb-4">
            {safeProject.description}
          </p>
          
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Funding Goal:</span>
                <span className="font-medium text-white">{formatCurrency(safeProject.fundingGoal)}</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(Math.max(safeProject.fundingPercentage, 0), 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {formatCurrency(safeProject.currentFunding)} raised
                </span>
                <span className="text-gray-400">
                  {Math.round(safeProject.fundingPercentage || 0)}%
                </span>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center">
              <span className="text-lg font-bold text-white">{safeProject.remainingShares}/{safeProject.totalShares}</span>
              <span className="text-xs text-gray-400">Available Shares</span>
            </div>
            
            <div className="flex flex-col justify-center items-center">
              <span className="text-lg font-bold text-white">{formatCurrency(safeProject.streamingRevenue)}</span>
              <span className="text-xs text-gray-400">Streaming Revenue</span>
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center text-gray-400 text-xs">
              <Clock size={14} className="mr-1" />
              {safeProject.createdAt ? 
                formatDistanceToNow(new Date(safeProject.createdAt), { addSuffix: true }) : 
                'Unknown date'}
            </div>
            <div className="text-xs text-gray-400">
              By {shortenAddress(safeProject.creator)}
            </div>
          </div>
          
          {/* Action button */}
          <Link href={`/projects/${safeProject.id}`} className="absolute inset-0" aria-label={`View ${safeProject.title}`}>
            <span className="sr-only">View project</span>
          </Link>
        </div>
      </div>
    );
  }
}