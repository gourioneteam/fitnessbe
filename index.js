require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const fitnessroutes = require('./src/routes/fitnessroutes');

const app = express();

// Allowed origins (must include your frontend Render URL)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173'];

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked CORS for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
};

// Apply CORS before routes
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.send('API running'));
app.use('/myfitness', fitnessroutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
