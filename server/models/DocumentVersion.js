const mongoose = require("mongoose");

const documentVersionSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: String,
    tags: [String],
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changeDescription: {
      type: String,
      maxlength: 500,
    },
    changes: {
      added: { type: Number, default: 0 },
      removed: { type: Number, default: 0 },
      modified: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

documentVersionSchema.index({ documentId: 1, version: -1 });

module.exports = mongoose.model("DocumentVersion", documentVersionSchema);
