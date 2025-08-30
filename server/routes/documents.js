const express = require("express");
const { body } = require("express-validator");
const {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentVersions,
  toggleLike,
} = require("../controllers/documentController");
const { protect } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");
const { getActivityFeed } = require("../services/activityService");

const router = express.Router();

// Validation rules
const documentValidation = [
  body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required"),
  body("category")
    .isIn([
      "Research",
      "Documentation",
      "Meeting Notes",
      "Project",
      "Knowledge Base",
      "Other",
    ])
    .withMessage("Invalid category"),
];

// Document routes
router.get("/", protect, getDocuments);
router.post(
  "/",
  protect,
  documentValidation,
  handleValidationErrors,
  createDocument
);
router.get("/:id", protect, getDocument);
router.put(
  "/:id",
  protect,
  documentValidation,
  handleValidationErrors,
  updateDocument
);
router.delete("/:id", protect, deleteDocument);
router.get("/:id/versions", protect, getDocumentVersions);
router.post("/:id/like", protect, toggleLike);

// Activity feed
router.get("/activities/feed", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getActivityFeed(req.user.id, page, limit);

    res.json({
      success: true,
      data: result.activities,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Activity feed error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
