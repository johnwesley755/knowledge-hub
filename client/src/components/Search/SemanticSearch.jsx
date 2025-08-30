import { useState, useEffect } from "react";

import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { searchAPI } from "../../services/api";
import { React } from "react";
import LoadingSpinner from "../Common/LoadingSpinner";
import {
  Brain,
  Zap,
  Eye,
  Calendar,
  User,
  Heart,
  TrendingUp,
} from "lucide-react";
import {
  formatRelativeTime,
  getCategoryColor,
  truncateText,
} from "../../utils/helpers";
import toast from "react-hot-toast";

const SemanticSearch = ({ query }) => {
  const [threshold, setThreshold] = useState(0.7);
  const [maxResults, setMaxResults] = useState(10);

  const semanticSearchMutation = useMutation(
    async (searchData) => {
      const response = await searchAPI.semanticSearch(searchData);
      return response.data;
    },
    {
      onError: (error) => {
        toast.error(error.response?.data?.message || "Semantic search failed");
      },
    }
  );

  const handleSearch = () => {
    if (!query.trim()) return;

    semanticSearchMutation.mutate({
      query: query.trim(),
      threshold,
      limit: maxResults,
    });
  };

  // Auto-search when query changes (debounced)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query, threshold, maxResults]);

  const results = semanticSearchMutation.data?.data || [];
  const isLoading = semanticSearchMutation.isLoading;

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Semantic Search
          </h2>
          <div className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
            AI-Powered
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Find documents based on meaning and context, not just keywords. Our AI
          understands the semantic relationship between your query and document
          content.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Similarity Threshold
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0.5"
                max="0.9"
                step="0.1"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-12">
                {Math.round(threshold * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Higher values return more precise but fewer results
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Results
            </label>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value))}
              className="input"
            >
              <option value={5}>5 results</option>
              <option value={10}>10 results</option>
              <option value={20}>20 results</option>
              <option value={50}>50 results</option>
            </select>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="btn btn-primary flex items-center space-x-2"
          >
            {isLoading ? <LoadingSpinner size="small" /> : <Zap size={16} />}
            <span>{isLoading ? "Searching..." : "Search Semantically"}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {query && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <LoadingSpinner size="large" />
              <p className="text-gray-600 mt-4">
                AI is analyzing semantic relationships...
              </p>
            </div>
          ) : results.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Semantic Results
                    </h3>
                    <p className="text-sm text-gray-600">
                      Found {results.length} semantically related documents
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <TrendingUp size={16} />
                    <span>Sorted by relevance</span>
                  </div>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result._id}
                    className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Similarity Score */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                                style={{ width: `${result.similarity * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {Math.round(result.similarity * 100)}% match
                            </span>
                          </div>

                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                              result.category
                            )}`}
                          >
                            {result.category}
                          </span>
                        </div>

                        {/* Title */}
                        <Link
                          to={`/documents/${result._id}`}
                          className="block group mb-2"
                        >
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {result.title}
                          </h3>
                        </Link>

                        {/* Summary */}
                        {result.summary && (
                          <p className="text-gray-700 mb-3 leading-relaxed">
                            {truncateText(result.summary, 200)}
                          </p>
                        )}

                        {/* Tags */}
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {result.tags.slice(0, 5).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer transition-colors"
                              >
                                #{tag}
                              </span>
                            ))}
                            {result.tags.length > 5 && (
                              <span className="px-2 py-1 text-xs text-gray-500">
                                +{result.tags.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User size={14} />
                            <span>{result.author?.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{formatRelativeTime(result.updatedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye size={14} />
                            <span>{result.metrics?.views || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart size={14} />
                            <span>{result.metrics?.likes?.length || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 ml-4">
                        <Link
                          to={`/documents/${result._id}`}
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
            </>
          ) : query && !isLoading ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No semantic matches found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting the similarity threshold or using different search
                terms. Semantic search works best with descriptive phrases
                rather than single keywords.
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Help Text */}
      {!query && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Brain className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                How Semantic Search Works
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Understands the meaning and context of your search query
                </li>
                <li>
                  • Finds documents with similar concepts, even if exact words
                  don't match
                </li>
                <li>
                  • Works best with descriptive phrases like "project management
                  techniques"
                </li>
                <li>
                  • Results are ranked by semantic similarity, not keyword
                  frequency
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;
