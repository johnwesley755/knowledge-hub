const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "created",
        "updated",
        "deleted",
        "viewed",
        "shared",
        "commented",
        "liked",
      ],
    },
    resource: {
      type: String,
      required: true,
      enum: ["document", "user", "comment"],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    metadata: {
      title: String,
      category: String,
      tags: [String],
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ resourceId: 1 });

module.exports = mongoose.model("Activity", activitySchema);
