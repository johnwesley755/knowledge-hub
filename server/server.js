const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Define allowed origins for CORS
const allowedOrigins = ["http://localhost:3000"];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
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
