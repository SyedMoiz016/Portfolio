import mongoose from "mongoose";
mongoose.set("bufferCommands", false);
export async function connectDB(uri = process.env.MONGO_URI) {
  if (!uri)
    throw new Error("MONGO_URI must be configured before starting the API.");
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    console.info("MongoDB connected.");
  } catch {
    throw new Error(
      "MongoDB connection failed. Check database availability and configuration.",
    );
  }
}
export async function disconnectDB() {
  await mongoose.disconnect();
}
