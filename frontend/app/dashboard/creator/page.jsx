import {
  Film,
  Star,
  TrendingUp,
  BarChart2,
  DollarSign,
  Clock,
  Edit,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function CreatorDashboard() {
  // Sample data
  const projects = [
    {
      id: 1,
      title: "The Last Algorithm",
      funding: 65,
      investors: 74,
      status: "Funding",
      daysLeft: 15,
    },
    {
      id: 2,
      title: "Neon Dreams",
      funding: 42,
      investors: 31,
      status: "Funding",
      daysLeft: 10,
    },
    {
      id: 3,
      title: "Whispers in the Dark",
      funding: 78,
      investors: 89,
      status: "Production",
      daysLeft: 0,
    },
  ];

  const stats = [
    {
      name: "Total Raised",
      value: "$18,500",
      icon: DollarSign,
      change: "+$2,500",
      changeType: "positive",
    },
    {
      name: "Active Projects",
      value: "2",
      icon: Film,
      change: "+1",
      changeType: "positive",
    },
    {
      name: "Total Investors",
      value: "105",
      icon: Users,
      change: "+24",
      changeType: "positive",
    },
    {
      name: "Avg. Funding",
      value: "62%",
      icon: BarChart2,
      change: "+8%",
      changeType: "positive",
    },
  ];

  const milestones = [
    {
      id: 1,
      project: "The Last Algorithm",
      task: "Script Finalization",
      due: "May 15",
      status: "In Progress",
    },
    {
      id: 2,
      project: "Neon Dreams",
      task: "Casting Complete",
      due: "May 20",
      status: "Pending",
    },
    {
      id: 3,
      project: "Whispers in the Dark",
      task: "Post-Production",
      due: "June 1",
      status: "Upcoming",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-20 w-80 h-80 bg-cyan-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Film className="text-blue-500" size={32} />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
            BacklotFlix
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/projects" className="text-gray-300 hover:text-white">
            Projects
          </Link>
          <Link href="/dashboard" className="text-white">
            Dashboard
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
            0x7f...3a4b
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Creator Dashboard
            </h1>
            <p className="text-gray-300">
              Manage your film projects and funding
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <Link href="/streaming">
              <button className="px-4 py-2 bg-gray-800/60 rounded-lg border border-gray-700 text-gray-300 hover:text-white transition-colors flex items-center">
                <Film className="h-5 w-5 mr-2" />
                Streaming
              </button>
            </Link>
            <button className="px-4 py-2 bg-gray-800/60 rounded-lg border border-gray-700 text-gray-300 hover:text-white transition-colors">
              Export Report
            </button>
            <Link href="/projects/new">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                New Project
              </button>
            </Link>
            <Link href="/streaming/upload">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Movie
              </button>
            </Link>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, statIdx) => (
            <div
              key={statIdx}
              className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    stat.changeType === "positive"
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  <stat.icon
                    className={`h-6 w-6 ${
                      stat.changeType === "positive"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  />
                </div>
              </div>
              <p
                className={`text-sm mt-3 ${
                  stat.changeType === "positive"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Projects */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Projects</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-14 w-14 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Film className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              project.status === "Funding"
                                ? "bg-amber-500/20 text-amber-400"
                                : project.status === "Production"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {project.status}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center">
                            <Users className="h-3 w-3 mr-1" />{" "}
                            {project.investors} investors
                          </span>
                          {project.daysLeft > 0 && (
                            <span className="text-xs text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />{" "}
                              {project.daysLeft} days left
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/3">
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${project.funding}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{project.funding}% funded</span>
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Upload */}
            <div className="mt-8 bg-gradient-to-br from-blue-900/40 to-cyan-900/20 rounded-xl p-6 border border-blue-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Share Project Updates
                  </h3>
                  <p className="text-sm text-gray-300">
                    Keep your investors engaged with regular updates
                  </p>
                </div>
                <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium transition-all">
                  <Upload className="h-5 w-5" />
                  <span>Upload Media</span>
                </button>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upcoming Milestones</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300">
                View All
              </button>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <ul className="divide-y divide-gray-700/50">
                {milestones.map((milestone) => (
                  <li key={milestone.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">
                          {milestone.task}
                        </p>
                        <p className="text-xs text-gray-400">
                          {milestone.project}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            milestone.status === "In Progress"
                              ? "bg-amber-500/20 text-amber-400"
                              : milestone.status === "Pending"
                              ? "bg-gray-500/20 text-gray-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {milestone.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {milestone.due}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700/40 hover:bg-gray-700 rounded-lg transition-colors">
                <Edit className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400">Add Milestone</span>
              </button>
            </div>

            {/* Investor Messages */}
            <div className="mt-8 bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <h3 className="font-bold text-lg mb-4">Recent Messages</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700/40 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="font-medium">Investor Group</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      2h ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    Hi there! We're excited about the progress on "The Last
                    Algorithm". Could you share some updates on the casting
                    process?
                  </p>
                </div>

                <div className="p-4 bg-gray-700/40 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="font-medium">Sarah Johnson</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      1d ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    Loved the latest production stills! When can we expect the
                    first trailer?
                  </p>
                </div>
              </div>

              <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700/40 hover:bg-gray-700 rounded-lg transition-colors">
                <span className="text-blue-400">View All Messages</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
