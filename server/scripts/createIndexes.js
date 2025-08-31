const mongoose = require("mongoose");
const Document = require("../models/Document");
require("dotenv").config();

const createIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create text index for search
    await Document.collection.createIndex(
      {
        title: "text",
        content: "text",
        summary: "text",
      },
      {
        weights: {
          title: 10,
          summary: 5,
          content: 1,
        },
        name: "text_search_index",
      }
    );

    // Create other indexes
    await Document.collection.createIndex({ author: 1, createdAt: -1 });
    await Document.collection.createIndex({ tags: 1 });
    await Document.collection.createIndex({ category: 1 });
    await Document.collection.createIndex({ visibility: 1 });
    await Document.collection.createIndex({ "collaborators.user": 1 });

    console.log("All indexes created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating indexes:", error);
    process.exit(1);
  }
};

createIndexes();
