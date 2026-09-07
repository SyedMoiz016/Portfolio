export function notFound(req, res) {
  res.status(404).json({ message: "API route not found." });
}
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === "entity.parse.failed")
    return res.status(400).json({ message: "Invalid JSON request body." });
  if (error.type === "entity.too.large")
    return res.status(413).json({ message: "Request body is too large." });
  if (error.code === "CORS_DENIED")
    return res.status(403).json({ message: "This origin is not allowed." });
  if (error.name === "ValidationError")
    return res
      .status(422)
      .json({ message: "Please check your message details." });
  const unavailable =
    [
      "MongoServerSelectionError",
      "MongooseServerSelectionError",
      "MongoNetworkError",
      "MongoNotConnectedError",
    ].includes(error.name) || error.name === "MongooseError";
  console.error("Contact API request failed.", { name: error.name });
  return res.status(unavailable ? 503 : 500).json({
    message: unavailable
      ? "The contact service is temporarily unavailable. Please try again later."
      : "Unable to send your message. Please try again later.",
  });
}
