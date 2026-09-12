import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

let connectionPromise = null;

export async function connectDB(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error("MONGO_URI must be configured before starting the API.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .then(() => {
        console.info("MongoDB connected.");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;

        console.error("MongoDB connection failed:", {
          name: error.name,
          message: error.message,
        });

        throw error;
      });
  }

  return connectionPromise;
}

export async function disconnectDB() {
  connectionPromise = null;
  await mongoose.disconnect();
}