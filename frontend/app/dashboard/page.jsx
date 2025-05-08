import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
            Your Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Manage your film investments and projects in one place
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/dashboard/investor">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border-2 border-pink-500/30 hover:border-pink-500/70 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Investor Dashboard</h2>
                <p className="text-gray-300 mb-4">
                  Track your investments, returns, and discover new opportunities
                </p>
                <div className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium text-white transition-all group-hover:opacity-90">
                  Enter Dashboard
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/creator">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border-2 border-blue-500/30 hover:border-blue-500/70 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Creator Dashboard</h2>
                <p className="text-gray-300 mb-4">
                  Manage your film projects, funding, and investor relations
                </p>
                <div className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium text-white transition-all group-hover:opacity-90">
                  Enter Dashboard
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}