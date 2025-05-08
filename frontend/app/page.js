"use client"
import Link from 'next/link'
import Image from 'next/image'
import { Film, Star, TrendingUp, ArrowRight } from 'lucide-react'
import ProjectCard from './components/ProjectCard'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

export default function Home() {
  const featuredProjects = [
    {
      id: 1,
      title: "Stellar Odyssey",
      description: "A groundbreaking space adventure that follows humanity's first interstellar colony mission.",
      coverImageURI: "/images/thumbnail-one.jpg",
      director: "Eliza Rodriguez",
      fundingGoal: "125000",
      currentFunding: "98750",
      investorsCount: 193,
      genre: "Sci-Fi",
      status: "Funding",
      statusCode: 1,
      createdAt: new Date().toISOString(),
      fundingPercentage: 79,
      totalShares: 1000,
      remainingShares: 450,
      creator: "0xaB5801a7D398351b8bE11C439e05C5B3259aeC9B"
    },
    {
      id: 2,
      title: "Neon Dreams",
      description: "In a dystopian future where dreams are commodified, a rogue dream hacker uncovers a conspiracy.",
      coverImageURI: "/images/thumbnail-two.jpg",
      director: "Sophia Chen",
      fundingGoal: "75000",
      currentFunding: "42000",
      investorsCount: 89,
      genre: "Cyberpunk",
      status: "Funding",
      statusCode: 1,
      createdAt: new Date().toISOString(),
      fundingPercentage: 56,
      totalShares: 750,
      remainingShares: 321,
      creator: "0x1234567890123456789012345678901234567890"
    }
  ]

  return (
    <div className="relative">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>

    {/* Navbar */}
    <NavBar />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
              Fund the Future
            </span>
            <br />
            of Independent Film
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Discover groundbreaking films, connect with visionary creators, and share in their success.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/projects" className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg font-medium text-white transition-all flex items-center justify-center">
              Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/streaming" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all flex items-center justify-center">
              Watch Films <Film className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/about" className="px-8 py-4 bg-gray-800/60 hover:bg-gray-800 rounded-lg font-medium border border-gray-700 transition-all">
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
              Featured
            </span> Projects
          </h2>
          <Link href="/projects" className="text-pink-400 hover:text-pink-300 flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-16">
          How <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">BacklotFlix</span> Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Film className="h-8 w-8 text-pink-400" />,
              title: "Discover Films",
              description: "Browse our curated selection of independent film projects seeking funding."
            },
            {
              icon: <Star className="h-8 w-8 text-purple-400" />,
              title: "Invest in What You Love",
              description: "Choose projects that resonate with you and invest at various tiers."
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-blue-400" />,
              title: "Share in the Success",
              description: "Earn returns as films reach milestones and generate revenue."
            }
          ].map((item, index) => (
            <div key={index} className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300">
              <div className="h-12 w-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}