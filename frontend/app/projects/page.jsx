// Enhanced page.jsx with debugging
"use client";
import { useState, useEffect } from "react";
import { Search, LayoutGrid, List, Bug, RefreshCw } from "lucide-react";
import Link from "next/link";
import ProjectCard from "../components/ProjectCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useProjects } from "../hooks/useProjects";
import { useAccount } from "wagmi";
import { useRouter, useSearchParams } from "next/navigation";
import {
  debugContractState,
  testProjectFiltering,
  forceProjectRefresh,
} from "../utils/debug-utils";

export default function ProjectsExplorationPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const [debugResults, setDebugResults] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const { address } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch projects based on active tab
  const { projects, loading, error, totalProjects, refreshProjects } =
    useProjects(
      activeTab === "my" ? "creator" : activeTab,
      activeTab === "my" ? address : null,
      refreshTrigger
    );

  // Handle refresh from URL params
  useEffect(() => {
    const refresh = searchParams.get("refresh");
    const fromCreate = searchParams.get("fromCreate");
    const debug = searchParams.get("debug");

    if (refresh === "true") {
      console.log("Refresh parameter detected, triggering refresh");
      setRefreshTrigger((prev) => prev + 1);
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("refresh");
      router.replace(url.pathname + url.search);
    }

    if (fromCreate === "true" && address) {
      console.log(
        "FromCreate parameter detected, switching to My Projects tab"
      );
      setActiveTab("my");
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("fromCreate");
      router.replace(url.pathname + url.search);
    }

    if (debug === "true") {
      setDebugMode(true);
    }
  }, [searchParams, address]);

  // Debug function
  const runDebug = async () => {
    setIsDebugging(true);
    try {
      const results = await debugContractState();
      setDebugResults(results);

      // Also test filtering if we have projects
      if (projects.length > 0) {
        testProjectFiltering(projects);
      }
    } catch (error) {
      console.error("Debug error:", error);
      setDebugResults({ error: error.message });
    } finally {
      setIsDebugging(false);
    }
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project &&
      (project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.creator.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      <NavBar />

      <div className="relative z-10 px-6 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Discover Film Projects
            </h1>
            <p className="text-gray-300">
              {totalProjects > 0
                ? `${totalProjects} projects to explore`
                : "Browse upcoming film projects"}
            </p>

            {/* Debug toggle */}
            <button
              className="text-xs text-gray-400 underline mt-1"
              onClick={() => setDebugMode(!debugMode)}
            >
              {debugMode ? "Hide Debug Tools" : "Show Debug Tools"}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search
                size={18}
                className="absolute top-2.5 left-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="p-2 bg-gray-800/60 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
              onClick={() => {
                console.log("Manual refresh triggered");
                setRefreshTrigger((prev) => prev + 1);
              }}
              title="Refresh projects"
            >
              <RefreshCw size={20} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Debug Panel */}
        {debugMode && (
          <div className="mb-6 p-4 bg-gray-800/60 border border-pink-500/50 rounded-lg">
            <h2 className="text-lg font-semibold flex items-center mb-3">
              <Bug size={18} className="mr-2 text-pink-500" />
              Debug Panel
            </h2>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-300">
                  Projects Count:{" "}
                  <span className="text-white font-medium">
                    {totalProjects}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  Loaded Projects:{" "}
                  <span className="text-white font-medium">
                    {projects.length}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  Filtered Projects:{" "}
                  <span className="text-white font-medium">
                    {filteredProjects.length}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  Active Tab:{" "}
                  <span className="text-white font-medium">{activeTab}</span>
                </div>
                <div className="text-sm text-gray-300">
                  Wallet Connected:{" "}
                  <span className="text-white font-medium">
                    {address ? "Yes" : "No"}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  Address:{" "}
                  <span className="text-white font-medium">
                    {address || "None"}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={runDebug}
                  disabled={isDebugging}
                  className="px-3 py-1 bg-pink-500/20 hover:bg-pink-500/40 border border-pink-500/30 rounded text-white text-sm"
                >
                  {isDebugging ? "Running..." : "Run Contract Debug"}
                </button>
                <button
                  onClick={() => {
                    forceProjectRefresh();
                  }}
                  className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 rounded text-white text-sm"
                >
                  Force Full Refresh
                </button>
                // Add to your debug panel
                <button
                  onClick={async () => {
                    const result = await debugProjectFetching(1); // Assuming project ID 1
                    setDebugResults(result);
                  }}
                  className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 rounded text-white text-sm"
                >
                  Debug Project #1
                </button>
                <button
                  onClick={() => {
                    window.localStorage.clear();
                    alert("Local storage cleared");
                  }}
                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded text-white text-sm"
                >
                  Clear Storage
                </button>
              </div>

              {debugResults && (
                <div className="mt-4 p-3 bg-gray-900/60 rounded border border-gray-700 overflow-auto max-h-40">
                  <pre className="text-xs text-gray-300">
                    {JSON.stringify(debugResults, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs & View Toggle */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex space-x-1 bg-gray-800/40 p-1 rounded-lg border border-gray-700/50">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Projects
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "my"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("my")}
              disabled={!address}
            >
              My Projects
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "funding"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("funding")}
            >
              Funding
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "streaming"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("streaming")}
            >
              Streaming
            </button>
          </div>

          <div className="flex space-x-1 bg-gray-800/40 p-1 rounded-lg border border-gray-700/50">
            <button
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-700"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-gray-700"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
              className="mt-2 px-3 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-white text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Projects Grid/List */}
        {!loading &&
          !error &&
          (viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="list"
                />
              ))}
            </div>
          ))}

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-gray-800/20 rounded-xl">
            <p className="text-gray-400 text-lg mb-4">
              {activeTab === "my"
                ? "You have not created any projects yet"
                : activeTab === "funding"
                ? "No funding projects found"
                : activeTab === "streaming"
                ? "No streaming projects found"
                : "No projects found matching your criteria"}
            </p>

            {activeTab === "my" && (
              <Link
                href="/create-project"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium"
              >
                Create Project
              </Link>
            )}

            {activeTab !== "my" && (
              <button
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
              >
                Refresh Projects
              </button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
