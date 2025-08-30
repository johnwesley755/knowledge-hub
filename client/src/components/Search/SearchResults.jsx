import { Link } from "react-router-dom";
import {
  Eye,
  Heart,
  Calendar,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  formatRelativeTime,
  getCategoryColor,
  truncateText,
} from "../../utils/helpers.js";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";

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
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="large" />
          <span className="ml-3 text-gray-600">Searching...</span>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search terms or filters to find what you're looking
          for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results
            </h2>
            <p className="text-sm text-gray-600">
              Found {pagination?.total || results.length} results for "{query}"
            </p>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </div>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((document) => (
          <div
            key={document._id}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Document Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                      document.category
                    )}`}
                  >
                    {document.category}
                  </span>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{document.author?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{formatRelativeTime(document.updatedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{document.metrics?.views || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <Link
                  to={`/documents/${document._id}`}
                  className="block group mb-2"
                >
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {highlightText(document.title, query)}
                  </h3>
                </Link>

                {/* Summary/Content Preview */}
                {document.summary && (
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {highlightText(truncateText(document.summary, 200), query)}
                  </p>
                )}

                {/* Tags */}
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {document.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        #{highlightText(tag, query)}
                      </span>
                    ))}
                    {document.tags.length > 5 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{document.tags.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Status: {document.status}</span>
                    <span>Version: {document.version || 1}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Heart
                      size={14}
                      className={
                        document.metrics?.likes?.length > 0
                          ? "text-red-500"
                          : ""
                      }
                    />
                    <span>{document.metrics?.likes?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 ml-4">
                <Link
                  to={`/documents/${document._id}`}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <Eye size={16} />
                  <span>View</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i;
                  if (pageNum > pagination.pages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        pageNum === pagination.page
                          ? "bg-primary-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
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
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
