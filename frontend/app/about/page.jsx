import { Film, Users, Globe, Award, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">BacklotFlix</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing film financing through blockchain technology and community-powered funding.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-pink-500/20 mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-4">
                BacklotFlix was founded in 2023 by a team of filmmakers, technologists, and finance professionals who saw an opportunity to disrupt the traditional film funding model.
              </p>
              <p className="text-gray-300 mb-4">
                Frustrated by the gatekeeping and lack of transparency in Hollywood, we set out to create a platform that would democratize access to film financing while providing fair compensation to all stakeholders.
              </p>
            </div>
            <div>
              <p className="text-gray-300 mb-4">
                Leveraging blockchain technology, we've built a system that ensures transparency, fair revenue sharing, and true ownership for both creators and investors.
              </p>
              <p className="text-gray-300">
                Today, BacklotFlix is home to hundreds of independent projects and thousands of investors who believe in the power of community-driven filmmaking.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: "75+", label: "Projects Funded", icon: <Film className="h-6 w-6" /> },
            { value: "$4.2M", label: "Raised", icon: <Heart className="h-6 w-6" /> },
            { value: "5,000+", label: "Investors", icon: <Users className="h-6 w-6" /> },
            { value: "42", label: "Countries", icon: <Globe className="h-6 w-6" /> }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 text-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Alex Rivera", role: "CEO & Founder", image: "/team/alex.jpg" },
              { name: "Sophia Chen", role: "CTO", image: "/team/sophia.jpg" },
              { name: "Marcus Johnson", role: "Head of Film", image: "/team/marcus.jpg" },
              { name: "Elena Vasquez", role: "Community Lead", image: "/team/elena.jpg" }
            ].map((member, index) => (
              <div key={index} className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                  {/* In a real app, you would use an actual image */}
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 rounded-xl p-8 md:p-12 border border-pink-500/30">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="h-12 w-12 mx-auto text-pink-400 mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 mb-6">
              To empower filmmakers and investors by creating a transparent, equitable, and sustainable ecosystem for independent film financing.
            </p>
            <p className="text-gray-400">
              We believe that great stories deserve to be told, and that the power to decide which stories get told should belong to the people, not just studio executives.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}