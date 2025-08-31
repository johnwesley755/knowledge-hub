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
    const iconProps = { size: 18, className: "text-white" };

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
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "updated":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "deleted":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "viewed":
        return "bg-gradient-to-r from-gray-500 to-gray-600";
      case "liked":
        return "bg-gradient-to-r from-pink-500 to-pink-600";
      case "shared":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  const getActivityText = (activity) => {
    const { action, resource, metadata } = activity;
    const title = metadata?.title || "Unknown";

    switch (action) {
      case "created":
        return `Created ${resource} "${title}"`;
      case "updated":
        return `Updated ${resource} "${title}"`;
      case "deleted":
        return `Deleted ${resource} "${title}"`;
      case "viewed":
        return `Viewed ${resource} "${title}"`;
      case "liked":
        return `Liked ${resource} "${title}"`;
      case "shared":
        return `Shared ${resource} "${title}"`;
      default:
        return `${action} ${resource} "${title}"`;
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
        return action;
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-sm text-gray-500 mt-4">
              Loading recent activities...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activities = activitiesData?.data?.data || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-8 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
        </div>

        {activities.length > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">
              Live Updates
            </span>
          </div>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="px-8 pb-8">
        {activities.length > 0 ? (
          <div className="max-h-96 overflow-y-auto pr-2 -mr-2">
            {/* Custom scrollbar styles */}
            <style jsx>{`
              .max-h-96::-webkit-scrollbar {
                width: 6px;
              }
              .max-h-96::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 10px;
              }
              .max-h-96::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
                border-radius: 10px;
              }
              .max-h-96::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
              }
            `}</style>

            <div className="space-y-6 pt-4">
              {activities.map((activity, index) => (
                <div key={activity._id} className="relative group">
                  {/* Timeline connector */}
                  {index < activities.length - 1 && (
                    <div className="absolute left-5 top-12 w-px h-8 bg-gradient-to-b from-gray-200 to-transparent"></div>
                  )}

                  <div className="flex items-start space-x-4 p-5 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 group-hover:scale-[1.02]">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(
                        activity.action
                      )} shadow-lg ring-4 ring-white`}
                    >
                      {getActivityIcon(activity.action)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="text-base">
                          <span className="font-bold text-gray-900">
                            {activity.user?.name}
                          </span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span
                            className={`font-semibold ${getActionTextColor(
                              activity.action
                            )}`}
                          >
                            {getActionLabel(activity.action)}
                          </span>
                          <span className="text-gray-600 ml-1">
                            {activity.resource}
                          </span>
                        </p>
                      </div>

                      {activity.metadata?.title && (
                        <div className="bg-white rounded-lg p-3 mb-3 border border-gray-100 shadow-sm">
                          <p className="font-medium text-gray-900 truncate">
                            "{activity.metadata.title}"
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-600 font-medium">
                            {formatRelativeTime(activity.createdAt)}
                          </span>
                        </div>

                        {activity.metadata?.category && (
                          <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full">
                            <span className="text-xs font-semibold">
                              {activity.metadata.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {activity.metadata?.tags &&
                        activity.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {activity.metadata.tags
                              .slice(0, 3)
                              .map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-3 py-1.5 text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full font-medium hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                                >
                                  #{tag}
                                </span>
                              ))}
                            {activity.metadata.tags.length > 3 && (
                              <span className="px-3 py-1.5 text-xs text-gray-500 bg-gray-50 rounded-full font-medium">
                                +{activity.metadata.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-2xl p-8 border-2 border-dashed border-gray-200">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  No Recent Activity
                </h4>
                <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
                  When you or your team start creating, editing, or sharing
                  documents, their activities will appear here.
                </p>
                <div className="mt-6 flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Footer */}
        {activities.length > 0 && (
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Auto-refreshing every 30 seconds</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
