import Link from 'next/link';
import { Clock, TrendingUp, Star, Film } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectCard({ project, variant = 'grid' }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Funding': return 'bg-blue-500/80';
      case 'Production': return 'bg-yellow-500/80';
      case 'Streaming': return 'bg-green-500/80';
      case 'Completed': return 'bg-purple-500/80';
      case 'Cancelled': return 'bg-red-500/80';
      default: return 'bg-pink-500/80';
    }
  };

  const getImageUrl = (uri) => {
    if (!uri) return '/placeholder-project.jpg';
    if (uri.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${uri.replace('ipfs://', '')}`;
    }
    return uri;
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    
    // Check if date is a valid Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return 'Unknown date';
    
    try {
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const calculateDaysLeft = (createdAt) => {
    if (!createdAt) return '?';
    
    const dateObj = createdAt instanceof Date ? createdAt : new Date(createdAt);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '?';
    
    try {
      return Math.ceil((dateObj.getTime() + 30 * 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
    } catch (error) {
      return '?';
    }
  };

  if (variant === 'list') {
    return (
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-pink-500/50 transition-colors">
        <Link href={`/projects/${project.id}`} className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-48 md:h-auto relative">
            <img
              src={getImageUrl(project.coverImageURI)}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-project.jpg';
              }}
            />
            <div className="absolute top-2 left-2">
              <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <div className="flex items-center text-sm text-gray-400">
                <Star size={14} className="mr-1 text-yellow-500" />
                {project.fundingPercentage}%
              </div>
            </div>
            <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center text-gray-400">
                <Film size={14} className="mr-1" />
                {formatDate(project.createdAt)}
              </div>
              <div className="flex items-center text-gray-400">
                <TrendingUp size={14} className="mr-1" />
                {project.currentFundingFormatted} raised
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Default grid view
  return (
    <Link href={`/projects/${project.id}`} className="group">
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 group-hover:border-pink-500/50 transition-colors h-full flex flex-col">
        <div className="relative aspect-video">
          <img
            src={getImageUrl(project.coverImageURI)}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-project.jpg';
            }}
          />
          <div className="absolute top-2 left-2">
            <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          {project.statusCode === 0 && (
            <div className="absolute top-2 right-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Clock size={14} className="mr-1" />
              {calculateDaysLeft(project.createdAt)}d left
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-bold mb-1 line-clamp-1">{project.title}</h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
          
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Raised</span>
              <span className="text-gray-400">{project.fundingPercentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full" 
                style={{ width: `${project.fundingPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-400">
              <TrendingUp size={14} className="mr-1" />
              {project.currentFundingFormatted}
            </div>
            <div className="text-gray-400">
              {formatDate(project.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}