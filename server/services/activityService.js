const Activity = require("../models/Activity");

// Create activity log
const createActivity = async (
  userId,
  action,
  resource,
  resourceId,
  details = {}
) => {
  try {
    await Activity.create({
      user: userId,
      action,
      resource,
      resourceId,
      details,
      metadata: details,
    });
  } catch (error) {
    console.error("Create activity error:", error);
  }
};

// Get recent activities
const getRecentActivities = async (userId, limit = 20) => {
  try {
    const activities = await Activity.find({
      $or: [
        { user: userId },
        // Add logic for team activities if needed
      ],
    })
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(limit);

    return activities;
  } catch (error) {
    console.error("Get recent activities error:", error);
    return [];
  }
};

// Get activity feed for dashboard
const getActivityFeed = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const activities = await Activity.find({
      // Get activities from user and their collaborators
      user: userId,
    })
      .populate("user", "name email avatar")
      .populate("resourceId", "title category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments({ user: userId });

    return {
      activities,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    };
  } catch (error) {
    console.error("Get activity feed error:", error);
    return { activities: [], pagination: { page: 1, pages: 0, total: 0 } };
  }
};

module.exports = {
  createActivity,
  getRecentActivities,
  getActivityFeed,
};
