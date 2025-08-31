import { Link } from "react-router-dom";
import LoadingSpinner from "../Common/LoadingSpinner";
import {
  Brain,
  Eye,
  Calendar,
  User,
  Heart,
  TrendingUp,
  FileText,
  Sparkles,
  Star,
  Clock,
  Tag,
} from "lucide-react";
import {
  formatRelativeTime,
  getCategoryColor,
  truncateText,
} from "../../utils/helpers";

const SemanticSearch = ({ results = [], loading = false, query }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 p-16 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full animate-pulse"></div>
          </div>
          <LoadingSpinner size="large" />
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            AI Semantic Analysis in Progress
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Our AI is analyzing semantic relationships and finding the most
            relevant content for your query...
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="text-sm text-blue-600 font-medium">
              Powered by Advanced AI
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-10 w-10 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-yellow-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          No Semantic Matches Found
        </h3>
        <p className="text-gray-600 max-w-lg mx-auto mb-6 leading-relaxed">
          Our AI couldn't find semantically related content for your query. Try
          using different keywords, descriptive phrases, or synonyms for better
          results.
        </p>
        <div className="bg-white rounded-lg p-4 max-w-md mx-auto border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Search Tips:</h4>
          <ul className="text-sm text-gray-600 text-left space-y-1">
            <li>• Use descriptive phrases instead of single words</li>
            <li>• Try synonyms or related terms</li>
            <li>• Include context or specific details</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Results Header */}
      <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>Semantic Results</span>
                <Sparkles className="w-5 h-5 text-blue-500" />
              </h3>
              <p className="text-gray-600 mt-1">
                Found{" "}
                <span className="font-semibold text-blue-600">
                  {results.length}
                </span>{" "}
                semantically related documents for
                <span className="font-medium text-gray-800"> "{query}"</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
              <TrendingUp size={16} className="text-green-500" />
              <span className="font-medium">Sorted by AI Relevance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Results List */}
      <div className="space-y-5">
        {results.map((result, index) => (
          <div
            key={result._id}
            className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
          >
            {/* Similarity Score Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-700">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-700 ease-out"
                            style={{
                              width: `${Math.round(result.similarity * 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-gray-900">
                            {Math.round(result.similarity * 100)}% AI Match
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Semantic similarity score
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full border ${getCategoryColor(
                    result.category
                  )} shadow-sm`}
                >
                  {result.category}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Enhanced Title */}
                  <Link
                    to={`/documents/${result._id}`}
                    className="block group/title mb-4"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors duration-200 leading-tight">
                      {result.title}
                    </h3>
                  </Link>

                  {/* Enhanced Summary */}
                  {result.summary && (
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {truncateText(result.summary, 200)}
                      </p>
                    </div>
                  )}

                  {/* Enhanced Tags */}
                  {result.tags && result.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Tags
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.tags.slice(0, 5).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 cursor-pointer transition-colors duration-200 border border-blue-100 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                        {result.tags.length > 5 && (
                          <span className="px-3 py-1.5 text-sm text-gray-500 bg-gray-50 rounded-full border border-gray-200">
                            +{result.tags.length - 5} more tags
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Metadata */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Author
                          </p>
                          <p className="text-sm text-gray-900 font-semibold">
                            {result.author?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Updated
                          </p>
                          <p className="text-sm text-gray-900 font-semibold">
                            {formatRelativeTime(result.updatedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Eye size={16} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Views
                          </p>
                          <p className="text-sm text-gray-900 font-semibold">
                            {result.metrics?.views || 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Heart size={16} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Likes
                          </p>
                          <p className="text-sm text-gray-900 font-semibold">
                            {result.metrics?.likes?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex-shrink-0 ml-6">
                  <Link
                    to={`/documents/${result._id}`}
                    className="group/btn inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

      {/* Results Summary Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{results.length}</span>{" "}
          results found using AI semantic analysis • Powered by advanced machine
          learning algorithms
        </p>
      </div>
    </div>
  );
};

export default SemanticSearch;
