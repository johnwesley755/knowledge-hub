const express = require("express");
const {
  askDocumentQuestion,
  getQAHistory,
} = require("../controllers/qaController");
const { protect } = require("../middleware/auth");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

const questionValidation = [
  body("question")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Question is required"),
];

router.post(
  "/ask",
  protect,
  questionValidation,
  handleValidationErrors,
  askDocumentQuestion
);
router.get("/history/:documentId", protect, getQAHistory);

module.exports = router;
