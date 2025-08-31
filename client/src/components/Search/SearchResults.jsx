import { Link } from "react-router-dom";
import {
  Eye,
  Heart,
  Calendar,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  Star,
  BookOpen,
  Zap,
} from "lucide-react";
import {
  formatRelativeTime,
  getCategoryColor,
  truncateText,
} from "../../utils/helpers.js";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

const SearchResults = ({
  results,
  pagination,
  loading,
  query,
  onPageChange,
}) => {
  const highlightText = (text, searchQuery) => {
    if (!searchQuery || !text) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-gradient-to-r from-yellow-200 to-yellow-300 px-1.5 py-0.5 rounded-md font-medium text-yellow-900"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative">
              <LoadingSpinner size="large" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Searching Knowledge Base
            </h3>
            <p className="text-gray-600">
              Finding the most relevant documents for you...
            </p>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-blue-50/40 to-indigo-50/60"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-gray-200/20 to-transparent rounded-full blur-3xl"></div>

        <div className="relative p-16 text-center">
          <div className="mb-8">
            <div className="inline-flex p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl shadow-lg">
              <FileText className="h-16 w-16 text-gray-400" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No Results Found
          </h3>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed mb-8">
            We couldn't find any documents matching your search. Try adjusting
            your search terms or filters.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <BookOpen className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                Try broader terms
              </p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <Zap className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                Use different keywords
              </p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">Check filters</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Results Header */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/80 via-blue-50/60 to-indigo-50/80"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-green-200/30 to-transparent rounded-full blur-2xl"></div>

        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Search Results
                </h2>
                <p className="text-gray-600 mt-1">
                  Found{" "}
                  <span className="font-semibold text-green-600">
                    {pagination?.total || results.length}
                  </span>{" "}
                  results for
                  <span className="font-semibold text-gray-900 ml-1">
                    "{query}"
                  </span>
                </p>
              </div>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Results List */}
      <div className="space-y-6">
        {results.map((document, index) => (
          <div
            key={document._id}
            className="group relative overflow-hidden bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
          >
            {/* Gradient background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Content */}
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Document Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <span
                      className={`px-3 py-1.5 text-sm font-semibold rounded-2xl shadow-sm ${getCategoryColor(
                        document.category
                      )} ring-1 ring-white/20`}
                    >
                      {document.category}
                    </span>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                        <User size={14} className="text-gray-400" />
                        <span className="font-medium">
                          {document.author?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="font-medium">
                          {formatRelativeTime(document.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-xl">
                        <Eye size={14} className="text-blue-500" />
                        <span className="font-medium text-blue-700">
                          {document.metrics?.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Title */}
                  <Link
                    to={`/documents/${document._id}`}
                    className="block group/title mb-4"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors duration-300 leading-tight">
                      {highlightText(document.title, query)}
                    </h3>
                  </Link>

                  {/* Summary/Content Preview */}
                  {document.summary && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl border border-gray-100">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {highlightText(
                          truncateText(document.summary, 200),
                          query
                        )}
                      </p>
                    </div>
                  )}

                  {/* Enhanced Tags */}
                  {document.tags && document.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {document.tags.slice(0, 5).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1.5 text-sm bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 cursor-pointer transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                        >
                          #{highlightText(tag, query)}
                        </span>
                      ))}
                      {document.tags.length > 5 && (
                        <span className="px-3 py-1.5 text-sm text-gray-500 bg-gray-50 rounded-xl font-medium">
                          +{document.tags.length - 5} more tags
                        </span>
                      )}
                    </div>
                  )}

                  {/* Enhanced Metadata */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-700">
                          Status: {document.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 rounded-xl">
                        <Clock size={14} className="text-purple-500" />
                        <span className="font-medium text-purple-700">
                          v{document.version || 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 px-4 py-2 bg-pink-50 rounded-xl">
                      <Heart
                        size={16}
                        className={`${
                          document.metrics?.likes?.length > 0
                            ? "text-pink-500 fill-current"
                            : "text-gray-400"
                        } transition-colors`}
                      />
                      <span className="font-semibold text-pink-700">
                        {document.metrics?.likes?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex-shrink-0 ml-6">
                  <Link
                    to={`/documents/${document._id}`}
                    className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                  >
                    <Eye
                      size={18}
                      className="group-hover/btn:scale-110 transition-transform"
                    />
                    <span>View Document</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/60 via-blue-50/40 to-purple-50/60"></div>

          <div className="relative p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-3 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of{" "}
                  <span className="font-bold text-indigo-600">
                    {pagination.total}
                  </span>{" "}
                  results
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="flex items-center space-x-2 px-5 py-3 bg-white text-gray-700 font-medium rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                  {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i;
                    if (pageNum > pagination.pages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          pageNum === pagination.page
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                            : "text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-md"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="flex items-center space-x-2 px-5 py-3 bg-white text-gray-700 font-medium rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
