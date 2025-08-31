const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

// Routes
const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/documents");
const searchRoutes = require("./routes/search");
const qaRoutes = require("./routes/qa");

module.exports = (app, io) => {
  // Make io available to routes
  app.set("io", io);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS
  app.use(
    cors({
      origin:
        process.env.CLIENT_URL || "https://knowledge-hub-psi-nine.vercel.app",
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Logging
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/documents", documentRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/qa", qaRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-document", (documentId) => {
      socket.join(documentId);
    });

    socket.on("leave-document", (documentId) => {
      socket.leave(documentId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // 404 handler (FIXED ✅)
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
};
