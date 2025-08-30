// Extract keywords from text
const extractKeywords = (text, limit = 10) => {
  // Simple keyword extraction - in production, use more sophisticated NLP
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .filter(
      (word) =>
        ![
          "this",
          "that",
          "with",
          "have",
          "will",
          "from",
          "they",
          "been",
          "said",
          "each",
          "which",
          "their",
          "time",
          "would",
          "there",
          "could",
          "other",
          "more",
          "very",
          "what",
          "know",
          "just",
          "first",
          "into",
          "over",
          "think",
          "also",
          "your",
          "work",
          "life",
          "only",
          "can",
        ].includes(word)
    );

  const frequency = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);
};

// Calculate reading time
const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Generate excerpt
const generateExcerpt = (text, length = 200) => {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
};

module.exports = {
  extractKeywords,
  calculateReadingTime,
  generateExcerpt,
};
