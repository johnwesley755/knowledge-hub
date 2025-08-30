const mongoose = require("mongoose");
const Document = require("../models/Document");
const {
  generateEmbedding,
  calculateSimilarity,
} = require("../services/embeddingService");

// @desc    Text search documents
// @route   GET /api/search/text
// @access  Private
const textSearch = async (req, res) => {
  try {
    const { q, category, author, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Build search query
    let searchQuery = {
      $text: { $search: q },
    };

    // Add user access filters
    searchQuery.$or = [
      { author: req.user.id },
      { visibility: "public" },
      { "collaborators.user": req.user.id },
    ];

    if (category) searchQuery.category = category;
    if (author) searchQuery.author = author;

    const documents = await Document.find(searchQuery, {
      score: { $meta: "textScore" },
    })
      .populate("author", "name email avatar")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limitNum);

    const total = await Document.countDocuments(searchQuery);

    res.json({
      success: true,
      data: documents,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        total,
      },
    });
  } catch (error) {
    console.error("Text search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Semantic search documents
// @route   POST /api/search/semantic
// @access  Private
const semanticSearch = async (req, res) => {
  try {
    const { query, threshold = 0.7, limit = 10 } = req.body;
    const numericThreshold = parseFloat(threshold);
    const numericLimit = parseInt(limit, 10);

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query);

    // Get all documents with embeddings that user can access
    const documents = await Document.find({
      embedding: { $exists: true },
      $or: [
        { author: req.user.id },
        { visibility: "public" },
        { "collaborators.user": req.user.id },
      ],
    })
      .populate("author", "name email avatar")
      .select("+embedding");

    // Calculate similarities
    const results = documents
      .map((doc) => ({
        ...doc.toObject(),
        similarity: calculateSimilarity(queryEmbedding, doc.embedding),
      }))
      .filter((doc) => doc.similarity >= numericThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, numericLimit)
      .map((doc) => {
        delete doc.embedding;
        return doc;
      });

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Semantic search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Private
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ success: true, data: { tags: [], titles: [] } });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Get tag suggestions
    const tagSuggestions = await Document.aggregate([
      {
        $match: {
          $or: [
            { author: userId },
            { visibility: "public" },
            { "collaborators.user": userId },
          ],
        },
      },
      { $unwind: "$tags" },
      { $match: { tags: { $regex: q, $options: "i" } } },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Get title suggestions
    const titleSuggestions = await Document.find({
      title: { $regex: q, $options: "i" },
      $or: [
        { author: req.user.id },
        { visibility: "public" },
        { "collaborators.user": req.user.id },
      ],
    })
      .select("title")
      .limit(5);

    res.json({
      success: true,
      data: {
        tags: tagSuggestions.map((t) => ({ text: t._id, count: t.count })),
        titles: titleSuggestions.map((d) => ({ text: d.title, id: d._id })),
      },
    });
  } catch (error) {
    console.error("Get search suggestions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  textSearch,
  semanticSearch,
  getSearchSuggestions,
};
