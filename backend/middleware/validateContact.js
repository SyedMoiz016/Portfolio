import { body, validationResult } from "express-validator";
import { serviceTypes } from "../models/Contact.js";
const stringField = (name) =>
  body(name).isString().withMessage("Must be text.").bail().trim();
export const contactRules = [
  stringField("name")
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must contain 2–80 characters."),
  stringField("email")
    .isLength({ max: 254 })
    .isEmail()
    .withMessage("Enter a valid email address.")
    .toLowerCase(),
  stringField("subject")
    .isLength({ min: 2, max: 150 })
    .withMessage("Subject must contain 2–150 characters."),
  stringField("service")
    .isIn(serviceTypes)
    .withMessage("Select a valid service."),
  stringField("message")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must contain 10–5000 characters."),
];
export function validateContact(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({
      message: "Please check the highlighted fields.",
      errors: errors
        .array({ onlyFirstError: true })
        .map((e) => ({ field: e.path, message: e.msg })),
    });
  next();
}
