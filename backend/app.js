const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./db'); // knex database instance

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
/*
app.use(
  cors({
    origin: "http://localhost:3000", // frontend
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
*/

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Library API running" });
});


// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/books", require("./routes/bookRoutes"));
app.use("/borrows", require("./routes/borrowRoutes"));
app.use("/users", require("./routes/userRoutes"));


module.exports = app;
