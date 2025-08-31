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
    const skip = (page - 1) * limit;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Build search query
    let searchQuery = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { summary: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
    };

    // Add user access filters
    const accessFilter = {
      $or: [
        { author: req.user.id },
        { visibility: "public" },
        { "collaborators.user": req.user.id },
      ],
    };

    // Combine search and access filters
    const finalQuery = {
      $and: [searchQuery, accessFilter],
    };

    // Add additional filters
    if (category) {
      finalQuery.category = category;
    }
    if (author) {
      finalQuery.author = author;
    }

    // Execute search
    const documents = await Document.find(finalQuery)
      .populate("author", "name email avatar")
      .populate("collaborators.user", "name email avatar")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments(finalQuery);

    res.json({
      success: true,
      data: documents,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Text search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during search",
    });
  }
};

// @desc    Semantic search documents
// @route   POST /api/search/semantic
// @access  Private
const semanticSearch = async (req, res) => {
  try {
    const { query, threshold = 0.7, limit = 10 } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query.trim());

    // Get all documents with embeddings that user can access
    const accessFilter = {
      $or: [
        { author: req.user.id },
        { visibility: "public" },
        { "collaborators.user": req.user.id },
      ],
    };

    const documents = await Document.find({
      ...accessFilter,
      embedding: { $exists: true, $ne: null },
    })
      .populate("author", "name email avatar")
      .populate("collaborators.user", "name email avatar")
      .select("+embedding");

    // Calculate similarities
    const results = documents
      .map((doc) => {
        const similarity = calculateSimilarity(queryEmbedding, doc.embedding);
        const docObject = doc.toObject();
        delete docObject.embedding; // Remove embedding from response
        return {
          ...docObject,
          similarity,
        };
      })
      .filter((doc) => doc.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: results,
      query,
      threshold,
      totalFound: results.length,
    });
  } catch (error) {
    console.error("Semantic search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during semantic search",
    });
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Private
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: { tags: [], titles: [] },
      });
    }

    const userId = req.user.id;

    // Access filter
    const accessFilter = {
      $or: [
        { author: userId },
        { visibility: "public" },
        { "collaborators.user": userId },
      ],
    };

    // Get tag suggestions
    const tagSuggestions = await Document.aggregate([
      { $match: accessFilter },
      { $unwind: "$tags" },
      {
        $match: {
          tags: { $regex: q, $options: "i" },
        },
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          text: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get title suggestions
    const titleSuggestions = await Document.find({
      ...accessFilter,
      title: { $regex: q, $options: "i" },
    })
      .select("title _id")
      .limit(5);

    res.json({
      success: true,
      data: {
        tags: tagSuggestions,
        titles: titleSuggestions.map((d) => ({
          text: d.title,
          id: d._id,
        })),
      },
    });
  } catch (error) {
    console.error("Get search suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting suggestions",
    });
  }
};

module.exports = {
  textSearch,
  semanticSearch,
  getSearchSuggestions,
};
