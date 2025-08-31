const calculateSimilarity = (vec1, vec2) => {
  if (!vec1 || !vec2 || vec1.length !== vec2.length) {
    return 0;
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

// Generate embedding for text (simplified version)
const generateEmbedding = async (text) => {
  try {
    // This is a simple embedding simulation
    // In production, use proper embedding services like:
    // - Google's Text Embedding API
    // - OpenAI's embedding API
    // - Hugging Face transformers

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .slice(0, 100);

    const embedding = new Array(384).fill(0);

    // Create a simple word-based embedding
    words.forEach((word, index) => {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        const char = word.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }

      // Distribute hash across embedding dimensions
      const pos = Math.abs(hash) % embedding.length;
      embedding[pos] += 1;

      // Add contextual information
      if (index > 0) {
        const contextPos = (pos + 1) % embedding.length;
        embedding[contextPos] += 0.5;
      }
    });

    // Normalize the embedding
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    );
    if (magnitude > 0) {
      return embedding.map((val) => val / magnitude);
    }

    return embedding;
  } catch (error) {
    console.error("Generate embedding error:", error);
    return new Array(384).fill(0);
  }
};

// Find similar documents based on embeddings
const findSimilarDocuments = async (
  targetEmbedding,
  documents,
  threshold = 0.7,
  limit = 10
) => {
  if (!targetEmbedding || !Array.isArray(documents)) {
    return [];
  }

  const similarities = documents
    .filter((doc) => doc.embedding && Array.isArray(doc.embedding))
    .map((doc) => ({
      document: doc,
      similarity: calculateSimilarity(targetEmbedding, doc.embedding),
    }))
    .filter((item) => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similarities;
};

module.exports = {
  calculateSimilarity,
  generateEmbedding,
  findSimilarDocuments,
};
