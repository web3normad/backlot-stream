import Link from 'next/link';
import { Film } from 'lucide-react';

export default function Footer({ isCreator = false }) {
  const gradient = isCreator 
    ? 'from-blue-400 to-cyan-500' 
    : 'from-pink-400 to-purple-500';

  return (
    <footer className="relative z-10 mt-16 border-t border-gray-800/80 px-6 py-8 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Film className={isCreator ? 'text-blue-500' : 'text-pink-500'} size={24} />
          <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
            BacklotFlix
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 md:mb-0">
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
        </div>
        
        <div className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} BacklotFlix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}