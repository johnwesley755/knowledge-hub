const express = require("express");
const {
  textSearch,
  semanticSearch,
  getSearchSuggestions,
} = require("../controllers/searchController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Add error handling middleware for search routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/text", protect, asyncHandler(textSearch));
router.post("/semantic", protect, asyncHandler(semanticSearch));
router.get("/suggestions", protect, asyncHandler(getSearchSuggestions));

module.exports = router;
