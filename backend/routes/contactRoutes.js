import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import contactController from "../controllers/contactController.js";
import {
  contactRules,
  validateContact,
} from "../middleware/validateContact.js";
export function contactRoutes(
  controller = contactController,
  { limit = 5 } = {},
) {
  const router = Router();
  router.post(
    "/",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        message: "Too many messages. Please try again in 15 minutes.",
      },
    }),
    (req, res, next) => {
      if (!req.is("application/json"))
        return res
          .status(415)
          .json({ message: "Content-Type must be application/json." });
      next();
    },
    contactRules,
    validateContact,
    controller,
  );
  return router;
}
