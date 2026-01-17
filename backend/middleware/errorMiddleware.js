const errorMiddleware = (err, req, res, next) => {
  console.error("Internal Server Error:", err);

  const isDev = process.env.NODE_ENV === "development";

  return res.status(500).json({
    message: "Internal server error",
    error: isDev ? err.message : undefined, // only show error in dev mode
  });
};

module.exports = errorMiddleware;
