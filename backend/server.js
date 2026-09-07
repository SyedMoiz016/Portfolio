import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
try {
  await connectDB();
  const port = Number(process.env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT must be a valid port number.");
  const server = createApp().listen(port, () =>
    console.info(`Portfolio API listening on port ${port}.`),
  );
  let closing = false;
  const shutdown = () => {
    if (closing) return;
    closing = true;
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
  server.on("error", () => {
    console.error("API could not start. Check port availability.");
    process.exit(1);
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
