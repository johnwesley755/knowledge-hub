const calculateSimilarity = (vec1, vec2) => {
  if (vec1.length !== vec2.length) {
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

// Find similar documents based on embeddings
const findSimilarDocuments = async (
  targetEmbedding,
  documents,
  threshold = 0.7,
  limit = 10
) => {
  const similarities = documents
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
  findSimilarDocuments,
};
