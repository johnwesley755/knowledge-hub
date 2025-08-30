import { useQuery } from "react-query";
import { documentsAPI } from "../../services/api";
import { formatRelativeTime } from "../../utils/helpers";
import LoadingSpinner from "../Common/LoadingSpinner";
import { FileText, Edit, Trash2, Eye, Heart, Plus, Share } from "lucide-react";

const ActivityFeed = () => {
  const { data: activitiesData, isLoading } = useQuery(
    ["activity-feed"],
    () => documentsAPI.getActivityFeed({ page: 1, limit: 10 }),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const getActivityIcon = (action) => {
    const iconProps = { size: 16, className: "text-white" };

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
        return "bg-green-500";
      case "updated":
        return "bg-blue-500";
      case "deleted":
        return "bg-red-500";
      case "viewed":
        return "bg-gray-500";
      case "liked":
        return "bg-pink-500";
      case "shared":
        return "bg-purple-500";
      default:
        return "bg-gray-400";
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const activities = activitiesData?.data?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activity
      </h3>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity._id} className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(
                  activity.action
                )}`}
              >
                {getActivityIcon(activity.action)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user?.name}</span>{" "}
                    <span className="text-gray-600">
                      {getActivityText(activity)}
                    </span>
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(activity.createdAt)}
                  </p>

                  {activity.metadata?.category && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {activity.metadata.category}
                      </span>
                    </>
                  )}
                </div>

                {activity.metadata?.tags &&
                  activity.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activity.metadata.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
