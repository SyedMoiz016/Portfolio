import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { contactRoutes } from "./routes/contactRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
export function createApp({
  controller,
  contactLimit,
  origins = process.env.CORS_ORIGINS || "",
} = {}) {
  const app = express();
  app.disable("x-powered-by");
  const hops = Number(process.env.TRUST_PROXY_HOPS || 0);
  if (!Number.isInteger(hops) || hops < 0)
    throw new Error("TRUST_PROXY_HOPS must be a non-negative integer.");
  if (hops) app.set("trust proxy", hops);
  app.use(helmet());
  const allowed = origins
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || allowed.includes(origin)) return cb(null, true);
        const error = new Error("Origin denied");
        error.code = "CORS_DENIED";
        cb(error);
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
      maxAge: 600,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 200,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { message: "Too many requests. Please try again later." },
      skip: (req) => req.path === "/api/health",
    }),
  );
  app.use(express.json({ limit: "16kb" }));
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use(
    "/api/contact",
    contactRoutes(controller, { limit: contactLimit ?? 5 }),
  );
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
