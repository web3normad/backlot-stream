'use client'

import { useState } from 'react'
import { User, Settings, Heart, Clock, Film, Star, CreditCard, LogOut } from 'lucide-react'
import Link from 'next/link'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('watchlist')
  const [subscriptionPlan, setSubscriptionPlan] = useState('premium') 
  
  // Sample data
  const watchlist = [
    { id: 1, title: "Stellar Odyssey", genre: "Sci-Fi", year: 2024, rating: 4.8, thumbnail: "/placeholder-movie1.jpg" },
    { id: 2, title: "Neon Dreams", genre: "Cyberpunk", year: 2023, rating: 4.5, thumbnail: "/placeholder-movie2.jpg" }
  ]
  
  const watchHistory = [
    { id: 3, title: "The Last Algorithm", genre: "Drama", year: 2023, rating: 4.2, thumbnail: "/placeholder-movie3.jpg", watchedAt: "2 days ago", progress: 85 },
    { id: 4, title: "Whispers in the Dark", genre: "Horror", year: 2022, rating: 4.0, thumbnail: "/placeholder-movie4.jpg", watchedAt: "1 week ago", progress: 45 }
  ]
  
  const investedMovies = [
    { id: 1, title: "Stellar Odyssey", amount: "2.5 ETH", roi: "+8.5%", status: "Revenue Sharing" },
    { id: 5, title: "The Baker's Son", amount: "1.2 ETH", roi: "Pending", status: "In Production" }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-bold">0x7f...3a4b</h3>
                  <span className="text-xs text-gray-400">Gold Investor</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('watchlist')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'watchlist' ? 'bg-gray-700/60 text-white' : 'text-gray-400 hover:bg-gray-800/60'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Watchlist</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'history' ? 'bg-gray-700/60 text-white' : 'text-gray-400 hover:bg-gray-800/60'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>Watch History</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('investments')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'investments' ? 'bg-gray-700/60 text-white' : 'text-gray-400 hover:bg-gray-800/60'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>My Investments</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'subscription' ? 'bg-gray-700/60 text-white' : 'text-gray-400 hover:bg-gray-800/60'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Subscription</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'settings' ? 'bg-gray-700/60 text-white' : 'text-gray-400 hover:bg-gray-800/60'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800/60 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors text-sm">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'watchlist' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Watchlist</h2>
                {watchlist.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {watchlist.map(movie => (
                      <div key={movie.id} className="group">
                        <Link href={`/streaming/${movie.id}`}>
                          <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden relative">
                            <img 
                              src={movie.thumbnail} 
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="p-3 bg-pink-500 rounded-full">
                                <Play className="h-5 w-5" fill="white" />
                              </div>
                            </div>
                          </div>
                        </Link>
                        <div className="mt-3">
                          <h3 className="font-medium text-white truncate">{movie.title}</h3>
                          <div className="flex justify-between items-center text-sm text-gray-400 mt-1">
                            <span>{movie.year}</span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span>{movie.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-10 text-center border border-gray-700">
                    <Film className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
                    <p className="text-gray-400 mb-6">Start adding movies to watch later</p>
                    <Link href="/streaming">
                      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Browse Movies
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Watch History</h2>
                {watchHistory.length > 0 ? (
                  <div className="space-y-4">
                    {watchHistory.map(movie => (
                      <div key={movie.id} className="flex items-start space-x-4 bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                        <Link href={`/streaming/${movie.id}`} className="flex-shrink-0">
                          <div className="w-24 h-16 bg-gray-700 rounded-lg overflow-hidden">
                            <img 
                              src={movie.thumbnail} 
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-white">{movie.title}</h3>
                              <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                                <span>{movie.year}</span>
                                <span>{movie.genre}</span>
                                <span className="flex items-center">
                                  <Star className="h-3 w-3 mr-1 text-yellow-400" />
                                  {movie.rating}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">{movie.watchedAt}</span>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                              <div 
                                className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full" 
                                style={{ width: `${movie.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>{movie.progress}% watched</span>
                              <Link href={`/streaming/${movie.id}`} className="text-pink-400 hover:text-pink-300">
                                Continue Watching
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-10 text-center border border-gray-700">
                    <Clock className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No watch history yet</h3>
                    <p className="text-gray-400 mb-6">Start watching movies and they'll appear here</p>
                    <Link href="/streaming">
                      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Browse Movies
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'investments' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Film Investments</h2>
                {investedMovies.length > 0 ? (
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700/50">
                      <thead className="bg-gray-700/40">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Film</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ROI</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                          <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {investedMovies.map((movie) => (
                          <tr key={movie.id} className="hover:bg-gray-700/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                                  <Film className="h-5 w-5 text-pink-400" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">{movie.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{movie.amount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${
                                movie.roi.includes('+') ? 'text-green-400' : 'text-gray-400'
                              }`}>
                                {movie.roi}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                movie.status === 'Revenue Sharing' ? 'bg-green-500/20 text-green-400' : 
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {movie.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/projects/${movie.id}`} className="text-pink-400 hover:text-pink-300">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-10 text-center border border-gray-700">
                    <TrendingUp className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No film investments yet</h3>
                    <p className="text-gray-400 mb-6">Invest in films to share in their success and earn returns</p>
                    <Link href="/projects">
                      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Browse Investment Opportunities
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'subscription' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Subscription</h2>
                
                {subscriptionPlan === 'none' ? (
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-10 text-center border border-gray-700">
                    <CreditCard className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active subscription</h3>
                    <p className="text-gray-400 mb-6">Upgrade to unlock premium content and features</p>
                    <Link href="/streaming#subscription">
                      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                        View Plans
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border border-pink-500/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {subscriptionPlan === 'basic' && 'Basic Plan'}
                          {subscriptionPlan === 'premium' && 'Premium Plan'}
                          {subscriptionPlan === 'investor' && 'Investor Plan'}
                        </h3>
                        <p className="text-gray-400">
                          {subscriptionPlan === 'basic' && 'Standard access to BacklotFlix content'}
                          {subscriptionPlan === 'premium' && 'Full access to all premium content and features'}
                          {subscriptionPlan === 'investor' && 'VIP access with exclusive investor benefits'}
                        </p>
                      </div>
                      <div className="text-2xl font-bold">
                        {subscriptionPlan === 'basic' && '$9.99'}
                        {subscriptionPlan === 'premium' && '$19.99'}
                        {subscriptionPlan === 'investor' && '$29.99'}
                        <span className="text-lg text-gray-400 ml-1">/month</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Plan Benefits</h4>
                        <ul className="space-y-3">
                          {subscriptionPlan === 'basic' && (
                            <>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Access to standard content</span>
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">720p quality</span>
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Watch on 1 device</span>
                              </li>
                            </>
                          )}
                          {subscriptionPlan === 'premium' && (
                            <>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Access to all content</span>
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">4K Ultra HD</span>
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Watch on 4 devices</span>
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Unlimited movies</span>
                              </li>
                            </>
                          )}
                          {subscriptionPlan === 'investor' && (
                            <>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">All Premium benefits</span>
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Exclusive investor content</span>
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Revenue share opportunities</span>
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">VIP support</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Payment Method</h4>
                        <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg border border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-16 bg-purple-500/20 rounded flex items-center justify-center">
                              <span className="text-xs font-medium">USDC</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Circle USD Coin</p>
                              <p className="text-xs text-gray-400">0x7f...3a4b</p>
                            </div>
                          </div>
                          <button className="text-sm text-pink-400 hover:text-pink-300">
                            Change
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <div>
                          <p className="text-sm text-gray-400">Next billing date</p>
                          <p className="font-medium">May 28, 2024</p>
                        </div>
                        <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold mb-4">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Display Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-800/60 rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none"
                            value="0x7f...3a4b"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email (optional)</label>
                          <input
                            type="email"
                            className="w-full px-4 py-3 bg-gray-800/60 rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-4">Playback Settings</h3>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-pink-500 rounded border-gray-700 focus:ring-pink-500 bg-gray-800"
                            defaultChecked
                          />
                          <span className="text-sm">Autoplay next episode</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-pink-500 rounded border-gray-700 focus:ring-pink-500 bg-gray-800"
                            defaultChecked
                          />
                          <span className="text-sm">Remember playback position</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-pink-500 rounded border-gray-700 focus:ring-pink-500 bg-gray-800"
                          />
                          <span className="text-sm">Auto-download for offline viewing</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-4">Video Quality</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Auto (Recommended)', '720p', '1080p', '4K (Premium only)', 'Data Saver'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 p-4 bg-gray-700/40 rounded-lg border border-gray-700 hover:bg-gray-700/60 cursor-pointer">
                            <input
                              type="radio"
                              name="videoQuality"
                              className="h-4 w-4 text-pink-500 border-gray-700 focus:ring-pink-500 bg-gray-800"
                              defaultChecked={option === 'Auto (Recommended)'}
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-gray-700">
                      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}