require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const fitnessroutes = require('./src/routes/fitnessroutes');

const app = express();

/**
 * ✅ Allowed origins
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [
      "https://fitnessjasna.vercel.app", // production frontend
      "http://localhost:5173",           // local dev
    ];

/**
 * ✅ CORS configuration
 */
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// ✅ Apply CORS globally BEFORE routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/**
 * ✅ Middleware
 */
app.use(bodyParser.json());
app.use(cookieParser());

/**
 * ✅ Basic route
 */
app.get("/", (req, res) => {
  res.send("Welcome to Happy Fitness API 🚀");
});

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use("/myfitness", fitnessroutes);

/**
 * ✅ Global error handler
 */
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Express error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message || "Unknown error",
  });
});

/**
 * ✅ Start server (Render requires this, no conditional)
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
