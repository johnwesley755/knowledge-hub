const Document = require("../models/Document");
const { askQuestion } = require("../services/geminiService");

// @desc    Ask question about document
// @route   POST /api/qa/ask
// @access  Private
const askDocumentQuestion = async (req, res) => {
  try {
    const { question, documentId } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    let context = "";
    let metadata = {};

    if (documentId) {
      // Get specific document
      const document = await Document.findById(documentId).populate(
        "author",
        "name email"
      );

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Check permissions
      const hasAccess =
        document.author._id.toString() === req.user.id ||
        document.visibility === "public" ||
        document.collaborators.some(
          (c) => c.user._id.toString() === req.user.id
        );

      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      context = `Title: ${document.title}\n\nContent: ${document.content}`;
      metadata = {
        documentId: document._id,
        documentTitle: document.title,
        author: document.author.name,
      };
    } else {
      // Search across all accessible documents for relevant context
      const searchQuery = {
        $text: { $search: question },
      };

      searchQuery.$or = [
        { author: req.user.id },
        { visibility: "public" },
        { "collaborators.user": req.user.id },
      ];

      const relevantDocs = await Document.find(searchQuery, {
        score: { $meta: "textScore" },
      })
        .populate("author", "name email")
        .sort({ score: { $meta: "textScore" } })
        .limit(3);

      if (relevantDocs.length > 0) {
        context = relevantDocs
          .map(
            (doc) =>
              `Document: ${doc.title}\nAuthor: ${
                doc.author.name
              }\nContent: ${doc.content.substring(0, 1000)}...`
          )
          .join("\n\n---\n\n");

        metadata = {
          sourceDocuments: relevantDocs.map((doc) => ({
            id: doc._id,
            title: doc.title,
            author: doc.author.name,
          })),
        };
      }
    }

    // ⚡ Fallback: If no context, still let Gemini answer using just the question
    const prompt = context
      ? `Answer the following question based on the document(s) below:\n\n${context}\n\nQuestion: ${question}`
      : `Answer this question:\n${question}`;

    const answer = await askQuestion(prompt);

    res.json({
      success: true,
      answer,
      metadata,
      question,
    });
  } catch (error) {
    console.error("Ask question error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get Q&A history for a document
// @route   GET /api/qa/history/:documentId
// @access  Private
const getQAHistory = async (req, res) => {
  try {
    // This would require a QA history model to store previous questions/answers
    // For now, return empty array
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("Get QA history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  askDocumentQuestion,
  getQAHistory,
};
