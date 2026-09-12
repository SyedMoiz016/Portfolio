import Contact from "../models/Contact.js";
import { connectDB } from "../config/db.js";

export async function createContact({
  name,
  email,
  subject,
  service,
  message,
}) {
  await connectDB();

  return Contact.create({
    name,
    email,
    subject,
    service,
    message,
  });
}