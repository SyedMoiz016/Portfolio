import { matchedData } from "express-validator";
import { createContact } from "../services/contactService.js";
export function makeContactController(save = createContact) {
  return async (req, res, next) => {
    try {
      await save(matchedData(req, { locations: ["body"] }));
      res.status(201).json({ message: "Your message has been received." });
    } catch (error) {
      next(error);
    }
  };
}
export default makeContactController();
