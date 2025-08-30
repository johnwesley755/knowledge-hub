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
      color: "bg-blue-500",
    },
    {
      name: "Recent Activity",
      value: statsData.recentActivity,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      name: "Collaborators",
      value: statsData.uniqueCollaborators,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      name: "New This Week",
      value: statsData.newThisWeek,
      icon: Clock,
      color: "bg-orange-500",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          Error loading documents. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your knowledge hub today.
            </p>
          </div>
          <Link
            to="/documents/new"
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>New Document</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
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
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  My Documents
                </h2>
                <span className="text-sm text-gray-500">
                  ({documentsData?.pagination?.total || 0} total)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors ${
                    showFilters
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Filter size={18} />
                </button>

                <div className="flex border rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-primary-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-primary-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="input"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="input"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    value={filters.author}
                    onChange={(e) =>
                      handleFilterChange("author", e.target.value)
                    }
                    className="input"
                  >
                    <option value="">All Authors</option>
                    <option value={user?.id}>My Documents</option>
                  </select>
                </div>
              </div>
            )}
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
              {documentsData.data.map((document) => (
                <DocumentCard
                  key={document._id}
                  document={document}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first document.
              </p>
              <Link
                to="/documents/new"
                className="btn btn-primary inline-flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Create Document</span>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {documentsData?.pagination && documentsData.pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
              <div className="text-sm text-gray-700">
                Showing page {documentsData.pagination.page} of{" "}
                {documentsData.pagination.pages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= documentsData.pagination.pages}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <ActivityFeed />

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/search"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Search className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Search Documents
                  </p>
                  <p className="text-xs text-gray-500">
                    Find documents quickly
                  </p>
                </div>
              </Link>

              <Link
                to="/qa"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Ask Questions
                  </p>
                  <p className="text-xs text-gray-500">
                    Get AI-powered answers
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
