const errorHandler = (err, _req, res, _next) => {
  console.error("Error:", err.message);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res.status(400).json({ message: `Duplicate value for: ${field}` });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File size exceeds the 5 MB limit." });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token." });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
};

export default errorHandler;
