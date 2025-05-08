// app/streaming/page.jsx
'use client'

import { Film, Search, Star, Play, Clock, Download, Share2, Plus, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

export default function StreamingPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'trending', name: 'Trending' },
    { id: 'topRated', name: 'Top Rated' },
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'nowPlaying', name: 'Now Playing' },
    { id: 'originals', name: 'Backlot Originals' }
  ]

  // TMDB configuration
  const TMDB_API_KEY = '2ca22f700bb9eff7e814bfbe16ba6831'
  const BASE_URL = 'https://api.themoviedb.org/3'
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/'
  const POSTER_SIZE = 'w500'
  const BACKDROP_SIZE = 'original'

  // Helper function to format movie data
  const formatMovieData = (movies) => {
    return movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      thumbnail: movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : '/placeholder-movie.jpg',
      backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}` : '/placeholder-hero.jpg',
      duration: '2h', // TMDB doesn't provide duration in list endpoints
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown',
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
      genre: movie.genre_ids ? movie.genre_ids[0] : 'Unknown', // This would need to be mapped to genre names
      isFeatured: movie.vote_average > 7.5,
      isTrending: true, // All movies from trending endpoint are trending
      isOriginal: false, // You would need to define your own originals
      funded: false, // Your own data
      watchPrice: 5.99,
      subscriptionRequired: movie.vote_average > 8 // Random logic for demo
    }))
  }

  // Fetch movies based on category
  const fetchMovies = async (category) => {
    setLoading(true)
    setError(null)
    
    try {
      let endpoint = ''
      
      switch(category) {
        case 'trending':
          endpoint = `/trending/movie/week?api_key=${TMDB_API_KEY}`
          break
        case 'topRated':
          endpoint = `/movie/top_rated?api_key=${TMDB_API_KEY}`
          break
        case 'upcoming':
          endpoint = `/movie/upcoming?api_key=${TMDB_API_KEY}`
          break
        case 'nowPlaying':
          endpoint = `/movie/now_playing?api_key=${TMDB_API_KEY}`
          break
        case 'originals':
          // For "originals" you could use a specific genre or collection
          endpoint = `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=878`
          break
        default:
          endpoint = `/movie/popular?api_key=${TMDB_API_KEY}`
      }
      
      const response = await fetch(`${BASE_URL}${endpoint}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      const formattedMovies = formatMovieData(data.results)
      
      setMovies(formattedMovies)
    } catch (error) {
      console.error("Error fetching movies:", error)
      setError("Failed to fetch movies. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Search for movies
  const searchMovies = async (query) => {
    if (!query) {
      fetchMovies(activeCategory)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      const formattedMovies = formatMovieData(data.results)
      
      setMovies(formattedMovies)
    } catch (error) {
      console.error("Error searching movies:", error)
      setError("Failed to search movies. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch movies when component mounts or category changes
  useEffect(() => {
    if (searchQuery) {
      searchMovies(searchQuery)
    } else {
      fetchMovies(activeCategory)
    }
  }, [activeCategory])

  // Handle search input with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMovies(searchQuery)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Filter movies based on category if needed
  const filteredMovies = movies.filter(movie => {
    if (activeCategory === 'all') return true
    
    // Additional filtering logic if needed
    // For example, you might want to further filter results from TMDB
    return true
  })

  // Find featured movie for hero section
  const featuredMovie = movies.length > 0 ? 
    movies.find(movie => movie.rating > 8) || movies[0] : 
    null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      
      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-96 bg-gradient-to-b from-purple-900/50 to-gray-900">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30" 
            style={{ backgroundImage: `url(${featuredMovie.backdrop})` }}
          />
          <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <span className="text-sm font-medium px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full inline-flex items-center">
                <Star className="h-3 w-3 mr-1" /> Featured
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-4">{featuredMovie.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{featuredMovie.description.substring(0, 150)}...</p>
              <div className="flex space-x-4">
                <Link href={`/streaming/${featuredMovie.id}`} className="flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors">
                  <Play className="h-5 w-5 mr-2" /> Watch Now
                </Link>
                <button className="flex items-center px-4 py-3 bg-gray-800/60 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors">
                  <Plus className="h-5 w-5 mr-2" /> Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Categories */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search movies, genres, creators..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id)
                  setSearchQuery('')
                }}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        {/* Movies Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-12 w-12 text-pink-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="group relative">
                <Link href={`/streaming/${movie.id}`}>
                  <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden relative">
                    <img 
                      src={movie.thumbnail} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                    />
                    {movie.subscriptionRequired && (
                      <span className="absolute top-2 left-2 bg-purple-500/80 text-white text-xs px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
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
        )}
        
        {filteredMovies.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <Film className="h-16 w-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No movies found</p>
          </div>
        )}
        
        {/* Subscription Plans */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Basic",
                price: "9.99",
                currency: "USDC",
                features: [
                  "Access to standard content",
                  "720p quality",
                  "Watch on 1 device",
                  "Limited to 10 movies/month"
                ]
              },
              {
                name: "Premium",
                price: "19.99",
                currency: "USDC",
                features: [
                  "Access to all content",
                  "4K Ultra HD",
                  "Watch on 4 devices",
                  "Unlimited movies",
                  "Early access to new releases"
                ],
                popular: true
              },
              {
                name: "Investor",
                price: "29.99",
                currency: "USDC",
                features: [
                  "All Premium benefits",
                  "Exclusive investor content",
                  "Revenue share opportunities",
                  "VIP support",
                  "Behind-the-scenes access"
                ]
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl p-6 border ${plan.popular ? 'border-pink-500 bg-gray-800/60' : 'border-gray-700 bg-gray-800/30'}`}
              >
                {plan.popular && (
                  <div className="text-xs font-medium px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full inline-flex items-center mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-3xl font-bold mb-4">
                  {plan.price} <span className="text-lg text-gray-400">{plan.currency}</span>
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 font-medium transition-colors">
                  Subscribe with Crypto
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}