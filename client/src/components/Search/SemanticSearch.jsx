import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 p-8 sm:p-12 lg:p-16 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full animate-pulse"></div>
          </div>
          <LoadingSpinner size="large" />
        </div>
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            AI Semantic Analysis in Progress
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">
            Our AI is analyzing semantic relationships and finding the most
            relevant content for your query...
          </p>
          <div className="flex items-center justify-center mt-3 sm:mt-4 space-x-2">
            <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="text-xs sm:text-sm text-blue-600 font-medium">
              Powered by Advanced AI
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 lg:p-16 text-center">
        <div className="relative mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-2 sm:right-0 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-yellow-500" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
          No Semantic Matches Found
        </h3>
        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto mb-4 sm:mb-6 leading-relaxed px-4">
          Our AI couldn't find semantically related content for your query. Try
          using different keywords, descriptive phrases, or synonyms for better
          results.
        </p>
        <div className="bg-white rounded-lg p-3 sm:p-4 max-w-md mx-auto border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
            💡 Search Tips:
          </h4>
          <ul className="text-xs sm:text-sm text-gray-600 text-left space-y-1">
            <li>• Use descriptive phrases instead of single words</li>
            <li>• Try synonyms or related terms</li>
            <li>• Include context or specific details</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Results Header */}
      <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>Semantic Results</span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Found{" "}
                <span className="font-semibold text-blue-600">
                  {results.length}
                </span>{" "}
                semantically related documents for
                <span className="font-medium text-gray-800 break-words">
                  {" "}
                  "{query}"
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-end">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-gray-200">
              <TrendingUp size={14} className="text-green-500 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">
                Sorted by AI Relevance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Results List */}
      <div className="space-y-4 sm:space-y-5">
        {results.map((result, index) => (
          <div
            key={result._id}
            className="group bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
          >
            {/* Similarity Score Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                        <span className="text-base sm:text-lg font-bold text-gray-700">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-1">
                        <div className="w-20 sm:w-24 h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-700 ease-out"
                            style={{
                              width: `${Math.round(result.similarity * 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                          <span className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                            {Math.round(result.similarity * 100)}% AI Match
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        Semantic similarity score
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-md sm:rounded-full border ${getCategoryColor(
                    result.category
                  )} shadow-sm self-start sm:self-auto`}
                >
                  {result.category}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 min-w-0 lg:pr-6">
                  {/* Enhanced Title */}
                  <Link
                    to={`/documents/${result._id}`}
                    className="block group/title mb-3 sm:mb-4"
                  >
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors duration-200 leading-tight">
                      {result.title}
                    </h3>
                  </Link>

                  {/* Enhanced Summary */}
                  {result.summary && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                        {truncateText(
                          result.summary,
                          window.innerWidth < 640 ? 150 : 200
                        )}
                      </p>
                    </div>
                  )}

                  {/* Enhanced Tags */}
                  {result.tags && result.tags.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Tags
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {result.tags
                          .slice(0, window.innerWidth < 640 ? 3 : 5)
                          .map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 cursor-pointer transition-colors duration-200 border border-blue-100 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        {result.tags.length >
                          (window.innerWidth < 640 ? 3 : 5) && (
                          <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-full border border-gray-200">
                            +
                            {result.tags.length -
                              (window.innerWidth < 640 ? 3 : 5)}{" "}
                            more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Metadata */}
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                          <User
                            size={14}
                            className="sm:w-4 sm:h-4 text-blue-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium">
                            Author
                          </p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold truncate">
                            {result.author?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock
                            size={14}
                            className="sm:w-4 sm:h-4 text-green-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium">
                            Updated
                          </p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold truncate">
                            {formatRelativeTime(result.updatedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                          <Eye
                            size={14}
                            className="sm:w-4 sm:h-4 text-purple-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium">
                            Views
                          </p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold">
                            {result.metrics?.views || 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart
                            size={14}
                            className="sm:w-4 sm:h-4 text-red-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium">
                            Likes
                          </p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold">
                            {result.metrics?.likes?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex-shrink-0 w-full lg:w-auto">
                  <Link
                    to={`/documents/${result._id}`}
                    className="group/btn inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full lg:w-auto text-sm sm:text-base"
                  >
                    <Eye
                      size={16}
                      className="sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform"
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100 text-center">
        <p className="text-xs sm:text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{results.length}</span>{" "}
          results found using AI semantic analysis • Powered by advanced machine
          learning algorithms
        </p>
      </div>
    </div>
  );
};

export default SemanticSearch;
