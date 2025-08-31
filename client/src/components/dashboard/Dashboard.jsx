import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useDocuments } from "../../hooks/useDocuments.js";
import { documentsAPI } from "../../services/api.js";

import DocumentCard from "./DocumentCard.jsx";
import ActivityFeed from "./ActivityFeed.jsx";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";
import {
  Plus,
  Filter,
  Grid,
  List,
  TrendingUp,
  BookOpen,
  Users,
  Clock,
  Search,
  BarChart3,
  Calendar,
  Star,
  ArrowRight,
  ChevronDown,
  X,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: "",
    status: "",
    author: "",
  });
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [statsData, setStatsData] = useState({
    recentActivity: 0,
    uniqueCollaborators: 0,
    newThisWeek: 0,
  });

  const { data: documentsData, isLoading, error } = useDocuments(filters);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await documentsAPI.getStats();
        if (response.data.success) {
          setStatsData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      name: "Total Documents",
      value: documentsData?.pagination?.total || 0,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      trend: "up",
    },
    {
      name: "Recent Activity",
      value: statsData.recentActivity,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      trend: "up",
    },
    {
      name: "Collaborators",
      value: statsData.uniqueCollaborators,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      change: "+5%",
      trend: "up",
    },
    {
      name: "New This Week",
      value: statsData.newThisWeek,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      change: "+15%",
      trend: "up",
    },
  ];

  const categories = [
    "Research",
    "Documentation",
    "Meeting Notes",
    "Project",
    "Knowledge Base",
    "Other",
  ];

  const quickActions = [
    {
      title: "Search Documents",
      description: "Find documents quickly with AI-powered search",
      icon: Search,
      link: "/search",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Ask Questions",
      description: "Get AI-powered answers from your knowledge base",
      icon: TrendingUp,
      link: "/qa",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "View Analytics",
      description: "Analyze document performance and engagement",
      icon: BarChart3,
      link: "/analytics",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      category: "",
      status: "",
      author: "",
    });
  };

  const hasActiveFilters = filters.category || filters.status || filters.author;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 mb-4">
            Error loading documents. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30">
      <div className="space-y-8 p-6">
        {/* Welcome Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  {getGreeting()}, {user?.name}!
                </h1>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-600 text-lg">
                Here's what's happening with your knowledge hub today.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/documents/new"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New Document</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.name}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 hover:shadow-lg transition-all duration-200 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}
                >
                  <div
                    className={`bg-gradient-to-r ${stat.color} w-6 h-6 rounded flex items-center justify-center`}
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end mt-2">
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toolbar */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      My Documents
                    </h2>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {documentsData?.pagination?.total || 0} total
                    </span>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-full flex items-center space-x-1"
                      >
                        <X size={12} />
                        <span>Clear filters</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        showFilters
                          ? "bg-blue-100 text-blue-700 shadow-sm"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Filter size={18} />
                    </button>

                    <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 transition-all duration-200 ${
                          viewMode === "grid"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        <Grid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 transition-all duration-200 ${
                          viewMode === "list"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="relative">
                        <select
                          value={filters.category}
                          onChange={(e) =>
                            handleFilterChange("category", e.target.value)
                          }
                          className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                        >
                          <option value="">All Categories</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <select
                          value={filters.status}
                          onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                          }
                          className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                        >
                          <option value="">All Status</option>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <select
                          value={filters.author}
                          onChange={(e) =>
                            handleFilterChange("author", e.target.value)
                          }
                          className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                        >
                          <option value="">All Authors</option>
                          <option value={user?.id}>My Documents</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Grid/List */}
            {documentsData?.data?.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-4"
                }
              >
                {documentsData.data.map((document, index) => (
                  <div
                    key={document._id}
                    className="animate-in fade-in-0 slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <DocumentCard document={document} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No documents found
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {hasActiveFilters
                    ? "No documents match your current filters. Try adjusting your search criteria."
                    : "Get started by creating your first document and building your knowledge hub."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                  <Link
                    to="/documents/new"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Create Document</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {documentsData?.pagination &&
              documentsData.pagination.pages > 1 && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-semibold">
                        {documentsData.pagination.page}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold">
                        {documentsData.pagination.pages}
                      </span>{" "}
                      ({documentsData.pagination.total} total documents)
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page <= 1}
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={
                          filters.page >= documentsData.pagination.pages
                        }
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ActivityFeed />

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                Quick Actions
                <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-100"
                  >
                    <div
                      className={`${action.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
