const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    summary: {
      type: String,
      maxlength: 500,
    },
    tags: [
      {
        type: String,
        maxlength: 50,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        "Research",
        "Documentation",
        "Meeting Notes",
        "Project",
        "Knowledge Base",
        "Other",
      ],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permissions: {
          type: String,
          enum: ["read", "edit", "admin"],
          default: "read",
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["private", "team", "public"],
      default: "private",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    embedding: {
      type: [Number],
      select: false,
    },
    version: {
      type: Number,
      default: 1,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attachments: [
      {
        filename: String,
        url: String,
        size: Number,
        mimetype: String,
      },
    ],
    metrics: {
      views: { type: Number, default: 0 },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      downloads: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better search performance
documentSchema.index({ title: "text", content: "text", tags: "text" });
documentSchema.index({ author: 1, createdAt: -1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ category: 1 });
documentSchema.index({ "collaborators.user": 1 });

module.exports = mongoose.model("Document", documentSchema);
