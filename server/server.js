const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin:
      process.env.CLIENT_URL || "https://knowledge-hub-psi-nine.vercel.app",
    methods: ["GET", "POST"],
  },
});

// Connect to database
connectDB();

// Initialize app with middleware
require("./app")(app, io);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, server, io };
