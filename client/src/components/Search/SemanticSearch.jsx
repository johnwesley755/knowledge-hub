import React, { useState, useEffect, useCallback } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { searchAPI } from "../../services/api.js";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";
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
} from "../../utils/helpers.js";
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

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;

    semanticSearchMutation.mutate({
      query: query.trim(),
      threshold,
      limit: maxResults,
    });
  }, [query, threshold, maxResults, semanticSearchMutation]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query, handleSearch]);

  const results = semanticSearchMutation.data?.data || [];
  const isLoading = semanticSearchMutation.isLoading;

  return (
    <div className="space-y-6">
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
          Find documents based on meaning and context, not just keywords.
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
              Higher values return more precise but fewer results.
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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {query && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <LoadingSpinner size="large" />
              <p className="text-gray-600 mt-4">AI is analyzing...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {results.length} Semantically Related Documents
                </h3>
              </div>
              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result._id}
                    className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(result.similarity * 100)}% match
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                          result.category
                        )}`}
                      >
                        {result.category}
                      </span>
                    </div>
                    <Link
                      to={`/documents/${result._id}`}
                      className="block group mb-2"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600">
                        {result.title}
                      </h3>
                    </Link>
                    {result.summary && (
                      <p className="text-gray-700 mb-3">
                        {truncateText(result.summary, 200)}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{result.author?.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formatRelativeTime(result.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No semantic matches found
              </h3>
              <p className="text-gray-500">
                Try adjusting the similarity threshold.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;
