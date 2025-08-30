const { getGeminiModel } = require("../config/gemini");

// Small helper to delay retries
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Wrapper for Gemini calls with retry handling
const callWithRetry = async (fn, maxRetries = 3) => {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        // Default retry delay
        let delay = 20000; // 20s fallback

        // If API provided RetryInfo → use it
        const retryInfo = error.errorDetails?.find((e) =>
          e["@type"]?.includes("RetryInfo")
        );
        if (retryInfo?.retryDelay) {
          delay = parseInt(retryInfo.retryDelay) * 1000;
        }

        console.warn(
          `⚠️ Gemini quota hit (429). Retrying in ${
            delay / 1000
          }s... (Attempt ${attempt + 1}/${maxRetries})`
        );
        await sleep(delay);
        attempt++;
        continue;
      }
      throw error; // Non-429 error → rethrow
    }
  }

  throw new Error("Max retries reached for Gemini API request.");
};

// Generate summary and tags for document content
const generateSummaryAndTags = async (content) => {
  try {
    const model = getGeminiModel();
    const prompt = `
    Please analyze the following document content and provide:
    1. A concise summary (max 200 words)
    2. Relevant tags (5-10 keywords)
    
    Format your response as JSON:
    {
      "summary": "...",
      "tags": ["tag1", "tag2", ...]
    }
    
    Document content:
    ${content.substring(0, 4000)}
    `;

    const result = await callWithRetry(() => model.generateContent(prompt));
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return {
        summary: parsed.summary || "",
        tags: parsed.tags || [],
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        summary: content.substring(0, 200) + "...",
        tags: [],
      };
    }
  } catch (error) {
    console.error("Generate summary and tags error:", error);
    return {
      summary: content.substring(0, 200) + "...",
      tags: [],
    };
  }
};

// Generate embedding for semantic search
const generateEmbedding = async (text) => {
  try {
    // Dummy embedding generator (placeholder)
    const words = text.toLowerCase().split(/\s+/).slice(0, 100);
    const embedding = new Array(384).fill(0);

    words.forEach((word, index) => {
      const hash = word.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
      embedding[index % 384] += Math.abs(hash) / 1000000;
    });

    // Normalize
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    );
    return embedding.map((val) => val / magnitude);
  } catch (error) {
    console.error("Generate embedding error:", error);
    return new Array(384).fill(0);
  }
};

// Answer questions based on context
const askQuestion = async (question, context) => {
  try {
    const model = getGeminiModel();
    const prompt = `
    Based on the following context, please answer the question. 
    If the context doesn't contain enough information to answer the question, please say so.
    
    Context:
    ${context}
    
    Question: ${question}
    
    Please provide a helpful and accurate answer based on the context provided.
    `;

    const result = await callWithRetry(() => model.generateContent(prompt));
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Ask question error:", error);
    return "I'm sorry, I encountered an error while processing your question. Please try again.";
  }
};

module.exports = {
  generateSummaryAndTags,
  generateEmbedding,
  askQuestion,
};
