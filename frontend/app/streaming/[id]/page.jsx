// app/streaming/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, Share2, Download, ChevronLeft, Star, Loader } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default function MoviePage() {
  const [movie, setMovie] = useState(null)
  const [similarMovies, setSimilarMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(138 * 60) // Default duration in seconds
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  // Get the movie ID from the URL
  const params = useParams()
  const movieId = params.id
  
  // TMDB configuration
  const TMDB_API_KEY = '2ca22f700bb9eff7e814bfbe16ba6831'
  const BASE_URL = 'https://api.themoviedb.org/3'
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/'
  const POSTER_SIZE = 'w500'
  const BACKDROP_SIZE = 'original'
  
  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }
  
  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch movie details
        const movieResponse = await fetch(
          `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
        )
        
        if (!movieResponse.ok) {
          throw new Error(`HTTP error! Status: ${movieResponse.status}`)
        }
        
        const movieData = await movieResponse.json()
        
        // Process movie data
        const processedMovie = {
          id: movieData.id,
          title: movieData.title,
          description: movieData.overview,
          year: movieData.release_date ? new Date(movieData.release_date).getFullYear() : 'Unknown',
          rating: movieData.vote_average ? movieData.vote_average.toFixed(1) : 'N/A',
          genre: movieData.genres && movieData.genres.length > 0 ? movieData.genres[0].name : 'Unknown',
          duration: movieData.runtime ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m` : 'Unknown',
          director: movieData.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown',
          cast: movieData.credits?.cast?.slice(0, 4).map(actor => actor.name) || [],
          funded: false, // Your own data
          investors: 0, // Your own data
          revenueShared: "$0", // Your own data
          thumbnail: movieData.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movieData.poster_path}` : '/placeholder-movie1.jpg',
          backdrop: movieData.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${movieData.backdrop_path}` : '/placeholder-hero.jpg',
          videoUrl: movieData.videos?.results?.length > 0 ? 
            `https://www.youtube.com/embed/${movieData.videos.results[0].key}` : 
            '/placeholder-video.mp4',
          isPremium: movieData.vote_average > 8 // Random logic for demo
        }
        
        setMovie(processedMovie)
        
        // Set duration if available
        if (movieData.runtime) {
          setDuration(movieData.runtime * 60) // Convert minutes to seconds
        }
        
        // Fetch similar movies
        const similarResponse = await fetch(
          `${BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
        )
        
        if (!similarResponse.ok) {
          throw new Error(`HTTP error! Status: ${similarResponse.status}`)
        }
        
        const similarData = await similarResponse.json()
        
        // Process similar movies
        const processedSimilarMovies = similarData.results.slice(0, 5).map(movie => ({
          id: movie.id,
          title: movie.title,
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown',
          rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
          thumbnail: movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : '/placeholder-movie.jpg',
        }))
        
        setSimilarMovies(processedSimilarMovies)
      } catch (error) {
        console.error("Error fetching movie details:", error)
        setError("Failed to fetch movie details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    if (movieId) {
      fetchMovieDetails()
    }
  }, [movieId])
  
  // Handle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    setShowControls(true)
  }
  
  // Handle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted)
    setShowControls(true)
  }
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
    setShowControls(true)
  }
  
  // Handle progress bar change
  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    setShowControls(true)
  }
  
  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeoutId
    if (isPlaying && showControls) {
      timeoutId = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
    return () => clearTimeout(timeoutId)
  }, [isPlaying, showControls])
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ':
          togglePlay()
          break
        case 'm':
          toggleMute()
          break
        case 'f':
          toggleFullscreen()
          break
        case 'ArrowRight':
          setCurrentTime(prev => Math.min(prev + 5, duration))
          break
        case 'ArrowLeft':
          setCurrentTime(prev => Math.max(prev - 5, 0))
          break
        default:
          break
      }
      setShowControls(true)
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [duration])
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="h-16 w-16 text-pink-500 animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }
  
  // Error state
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-400 mb-6">{error || "Could not find movie details"}</p>
            <Link href="/streaming" className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors">
              Back to Browse
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black">
        {/* Video element */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isPlaying ? (
            <iframe 
              src={`${movie.videoUrl}?autoplay=1&mute=${isMuted ? 1 : 0}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img 
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-contain opacity-60"
            />
          )}
        </div>
        
        {/* Video Controls */}
        {showControls && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between p-6 transition-opacity">
            {/* Top Controls */}
            <div className="flex justify-between items-start">
              <Link href="/streaming" className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
                <ChevronLeft className="h-6 w-6" />
                <span>Back to Browse</span>
              </Link>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsInWatchlist(!isInWatchlist)}
                  className={`p-2 rounded-full ${isInWatchlist ? 'text-pink-500' : 'text-white hover:text-gray-300'}`}
                >
                  <Heart className="h-5 w-5" fill={isInWatchlist ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2 rounded-full text-white hover:text-gray-300">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full text-white hover:text-gray-300">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={togglePlay}
                className="p-4 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-12 w-12" fill="white" />
                ) : (
                  <Play className="h-12 w-12" fill="white" />
                )}
              </button>
            </div>
            
            {/* Bottom Controls */}
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="w-full">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `linear-gradient(to right, #ec4899 ${(currentTime / duration) * 100}%, #3f3f46 ${(currentTime / duration) * 100}%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  {/* Play/Pause Button */}
                  <button 
                    onClick={togglePlay}
                    className="text-white hover:text-gray-300"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </button>
                  
                  {/* Mute/Unmute Button */}
                  <button 
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300"
                  >
                    {isMuted ? (
                      <VolumeX className="h-6 w-6" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                  </button>
                </div>
                
                {/* Quality and Fullscreen */}
                <div className="flex space-x-4">
                  <div className="px-2 py-1 bg-black/50 rounded text-xs font-medium flex items-center">
                    <span className="text-pink-500 font-semibold">HD</span>
                  </div>
                  <button 
                    onClick={toggleFullscreen}
                    className="text-white hover:text-gray-300"
                  >
                    <Maximize className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Movie Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold">{movie.title}</h1>
                {movie.isPremium && (
                  <span className="px-2 py-1 bg-pink-600 text-xs font-semibold rounded">PREMIUM</span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
                <span>{movie.genre}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>{movie.rating}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Director</h3>
                <p className="text-gray-300">{movie.director}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={togglePlay}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Play className="h-5 w-5" />
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <button 
                onClick={() => setIsInWatchlist(!isInWatchlist)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Heart className="h-5 w-5" fill={isInWatchlist ? 'currentColor' : 'none'} />
                <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
              
              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
          
          {/* Funding Info */}
          <div className="bg-gray-800 rounded-lg p-6 space-y-6 h-fit">
            <h2 className="text-xl font-bold">Movie Funding</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Funding Status</h3>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${movie.funded ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <span className="font-semibold">{movie.funded ? 'Fully Funded' : 'Funding In Progress'}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Investors</h3>
                <p className="font-semibold">{movie.investors}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Revenue Shared</h3>
                <p className="font-semibold">{movie.revenueShared}</p>
              </div>
              
              <div className="pt-4">
                <div className="w-full bg-gray-700 h-2 rounded-full">
                  <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${movie.funded ? 100 : 65}%` }}></div>
                </div>
                <p className="text-right text-sm mt-1 font-medium">{movie.funded ? '100%' : '65%'} Funded</p>
              </div>
            </div>
            
            <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors">
              {movie.funded ? 'View Investment Details' : 'Invest in This Movie'}
            </button>
          </div>
        </div>
        
        {/* Similar Movies */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarMovies.map(movie => (
              <Link href={`/streaming/${movie.id}`} key={movie.id} className="group">
                <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                  <div className="aspect-[2/3] relative">
                    <img 
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold truncate">{movie.title}</h3>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{movie.year}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}