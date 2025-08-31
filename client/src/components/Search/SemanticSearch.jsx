import { Link } from 'react-router-dom'
import LoadingSpinner from '../Common/LoadingSpinner'
import { 
  Brain, 
  Eye, 
  Calendar, 
  User, 
  Heart,
  TrendingUp,
  FileText
} from 'lucide-react'
import { formatRelativeTime, getCategoryColor, truncateText } from '../../utils/helpers'

const SemanticSearch = ({ results = [], loading = false, query }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <LoadingSpinner size="large" />
        <p className="text-gray-600 mt-4">
          AI is analyzing semantic relationships...
        </p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No semantic matches found
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your search terms or using different keywords. Semantic
          search works best with descriptive phrases.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Semantic Results
            </h3>
            <p className="text-sm text-gray-600">
              Found {results.length} semantically related documents for "{query}
              "
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
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                        style={{
                          width: `${Math.round(result.similarity * 100)}%`,
                        }}
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
    </div>
  );
};

export default SemanticSearch;