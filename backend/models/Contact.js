import mongoose from "mongoose";
export const serviceTypes = [
  "Web Development",
  "App Development",
  "Logo Design",
  "Branding",
  "eBook Services",
  "Other",
];
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    service: { type: String, enum: serviceTypes, required: true },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);
contactSchema.index({ status: 1, createdAt: -1 });
export default mongoose.model("Contact", contactSchema);
