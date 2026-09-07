import Contact from "../models/Contact.js";
export async function createContact({
  name,
  email,
  subject,
  service,
  message,
}) {
  return Contact.create({ name, email, subject, service, message });
}
