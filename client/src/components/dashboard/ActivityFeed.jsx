import { useQuery } from "react-query";
import { documentsAPI } from "../../services/api";
import { formatRelativeTime } from "../../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  FileText,
  Edit,
  Trash2,
  Eye,
  Heart,
  Plus,
  Share,
  Clock,
  Activity,
} from "lucide-react";

const ActivityFeed = () => {
  const { data: activitiesData, isLoading } = useQuery(
    ["activity-feed"],
    () => documentsAPI.getActivityFeed({ page: 1, limit: 10 }),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const getActivityIcon = (action) => {
    const iconProps = {
      size: 14,
      className: "w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white",
    };

    switch (action) {
      case "created":
        return <Plus {...iconProps} />;
      case "updated":
        return <Edit {...iconProps} />;
      case "deleted":
        return <Trash2 {...iconProps} />;
      case "viewed":
        return <Eye {...iconProps} />;
      case "liked":
        return <Heart {...iconProps} />;
      case "shared":
        return <Share {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case "created":
        return "bg-gradient-to-r from-green-500 to-green-600 shadow-green-200";
      case "updated":
        return "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-200";
      case "deleted":
        return "bg-gradient-to-r from-red-500 to-red-600 shadow-red-200";
      case "viewed":
        return "bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-200";
      case "liked":
        return "bg-gradient-to-r from-pink-500 to-pink-600 shadow-pink-200";
      case "shared":
        return "bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-200";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-200";
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case "created":
        return "Created";
      case "updated":
        return "Updated";
      case "deleted":
        return "Deleted";
      case "viewed":
        return "Viewed";
      case "liked":
        return "Liked";
      case "shared":
        return "Shared";
      default:
        return action.charAt(0).toUpperCase() + action.slice(1);
    }
  };

  const getActionTextColor = (action) => {
    switch (action) {
      case "created":
        return "text-green-600";
      case "updated":
        return "text-blue-600";
      case "deleted":
        return "text-red-600";
      case "viewed":
        return "text-gray-600";
      case "liked":
        return "text-pink-600";
      case "shared":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
              Loading recent activities...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activities = activitiesData?.data?.data || [];

  return (
    <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      {/* Header - Fully Responsive */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 lg:p-6 xl:p-8 pb-2 sm:pb-3 lg:pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex-shrink-0 p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 leading-tight">
              Recent Activity
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:hidden">
              Live updates every 30s
            </p>
          </div>
        </div>

        {activities.length > 0 && (
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-50 rounded-full self-start sm:self-auto">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium text-blue-600 whitespace-nowrap">
              <span className="hidden sm:inline">Live Updates</span>
              <span className="sm:hidden">Live</span>
            </span>
          </div>
        )}
      </div>

      {/* Content Area - Enhanced Responsive Design */}
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8 pb-3 sm:pb-4 lg:pb-6 xl:pb-8">
        {activities.length > 0 ? (
          <div className="max-h-72 sm:max-h-80 lg:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1 sm:pr-2">
            <div className="space-y-3 sm:space-y-4 lg:space-y-5 pt-2 sm:pt-3 lg:pt-4">
              {activities.map((activity, index) => (
                <div key={activity._id} className="relative group">
                  {/* Timeline connector - Responsive */}
                  {index < activities.length - 1 && (
                    <div className="absolute left-3.5 sm:left-4 lg:left-5 top-8 sm:top-10 lg:top-12 w-0.5 h-4 sm:h-6 lg:h-8 bg-gradient-to-b from-gray-200 to-transparent z-0"></div>
                  )}

                  <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="flex items-start space-x-2.5 sm:space-x-3 lg:space-x-4 p-3 sm:p-4 lg:p-5">
                      {/* Activity Icon - Responsive */}
                      <div className="flex-shrink-0 relative z-10">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${getActivityColor(
                            activity.action
                          )} shadow-md ring-2 ring-white`}
                        >
                          {getActivityIcon(activity.action)}
                        </div>
                      </div>

                      {/* Activity Content - Enhanced Responsive Layout */}
                      <div className="flex-1 min-w-0 space-y-2 sm:space-y-2.5">
                        {/* User and Action - Mobile Optimized */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {activity.user?.name || "Unknown User"}
                            </span>
                            <span className="text-gray-300 text-xs sm:text-sm">
                              •
                            </span>
                            <span
                              className={`font-medium text-xs sm:text-sm ${getActionTextColor(
                                activity.action
                              )}`}
                            >
                              {getActionLabel(activity.action)}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600 sm:ml-1 truncate">
                            {activity.resource}
                          </span>
                        </div>

                        {/* Document Title - Enhanced Mobile Display */}
                        {activity.metadata?.title && (
                          <div className="bg-white rounded-md sm:rounded-lg p-2.5 sm:p-3 border border-gray-100 shadow-sm">
                            <p className="font-medium text-gray-900 text-sm sm:text-base leading-snug">
                              <span className="text-gray-400">"</span>
                              <span className="line-clamp-2 sm:line-clamp-1">
                                {activity.metadata.title}
                              </span>
                              <span className="text-gray-400">"</span>
                            </p>
                          </div>
                        )}

                        {/* Metadata Row - Improved Mobile Layout */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
                          {/* Timestamp */}
                          <div className="flex items-center space-x-1.5 bg-gray-100 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-xs sm:text-sm text-gray-600 font-medium">
                              {formatRelativeTime(activity.createdAt)}
                            </span>
                          </div>

                          {/* Category */}
                          {activity.metadata?.category && (
                            <div className="flex items-center px-2 sm:px-2.5 py-1 sm:py-1.5 bg-blue-100 text-blue-700 rounded-full">
                              <span className="text-xs sm:text-sm font-medium">
                                {activity.metadata.category}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Tags - Mobile Optimized */}
                        {activity.metadata?.tags &&
                          activity.metadata.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {activity.metadata.tags
                                .slice(0, 3)
                                .map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="inline-flex items-center px-2 sm:px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              {activity.metadata.tags.length > 3 && (
                                <span className="inline-flex items-center px-2 sm:px-2.5 py-1 text-xs text-gray-500 bg-gray-50 rounded-full">
                                  +{activity.metadata.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State - Enhanced Mobile Design */
          <div className="text-center py-8 sm:py-12 lg:py-16">
            <div className="relative max-w-sm mx-auto">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl blur-3xl opacity-30"></div>

              <div className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-dashed border-gray-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>

                <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  No Recent Activity
                </h4>

                <p className="text-sm sm:text-base text-gray-500 leading-relaxed px-2 sm:px-4">
                  When you or your team start creating, editing, or sharing
                  documents, their activities will appear here.
                </p>

                {/* Loading dots animation */}
                <div className="mt-4 sm:mt-6 flex justify-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full animate-pulse"></div>
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer - Auto-refresh indicator */}
        {activities.length > 0 && (
          <div className="mt-4 sm:mt-6 text-center border-t border-gray-100 pt-3 sm:pt-4">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                <span className="hidden sm:inline">
                  Auto-refreshing every 30 seconds
                </span>
                <span className="sm:hidden">Auto-refresh: 30s</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgb(243 244 246);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgb(156 163 175);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128);
        }

        @media (min-width: 640px) {
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
        }

        /* Line clamp utilities */
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
};

export default ActivityFeed;
