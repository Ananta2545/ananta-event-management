const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const vendorRoutes = require("./routes/vendor");
const userRoutes = require("./routes/user");

/* ── Initialise app ── */
const app = express();

/* ── Global middleware ── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ── API routes ── */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/user", userRoutes);

/* ── Health check ── */
app.get("/", (_req, res) => {
  res.json({ message: "Event Management System API is running." });
});

/* ── Error handler (must be last) ── */
app.use(errorHandler);

/* ── Start server ── */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
