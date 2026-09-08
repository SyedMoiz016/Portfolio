import { matchedData } from "express-validator";
import { createContact } from "../services/contactService.js";
import { notifyContact, emailFailureReason } from "../services/emailService.js";
export function makeContactController(
  save = createContact,
  notify = notifyContact,
) {
  return async (req, res, next) => {
    try {
      const data = matchedData(req, { locations: ["body"] });
      await save(data);
      // SMTP failure must not turn a successfully saved inquiry into a failed
      // submission, which could encourage visitors to submit duplicates.
      try {
        const result = await notify(data);
        if (result?.status === "unconfigured")
          console.warn(
            "Email notification not configured; inquiry is saved in MongoDB.",
          );
      } catch (error) {
        console.error(
          "Email notification failed; inquiry is saved in MongoDB.", emailFailureReason(error),
        );
      }
      res.status(201).json({ message: "Your message has been received." });
    } catch (error) {
      next(error);
    }
  };
}
export default makeContactController();
