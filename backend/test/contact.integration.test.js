import "dotenv/config";
import { test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../app.js";
import Contact from "../models/Contact.js";
import { makeContactController } from "../controllers/contactController.js";
import { createContact } from "../services/contactService.js";
test(
  "contact submission persists in MongoDB",
  { skip: !process.env.TEST_MONGO_URI },
  async () => {
    await mongoose.connect(process.env.TEST_MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    const email = `integration-${Date.now()}@example.com`;
    try {
      const res = await request(
        createApp({
          controller: makeContactController(createContact, async () => ({
            status: "sent",
          })),
        }),
      )
        .post("/api/contact")
        .send({
          name: "Integration Test",
          email,
          subject: "Persistence test",
          service: "Other",
          message: "Verify database persistence from the HTTP endpoint.",
        });
      assert.equal(res.status, 201);
      const saved = await Contact.findOne({ email });
      assert.ok(saved);
      assert.equal(saved.status, "new");
      assert.ok(saved.createdAt instanceof Date);
    } finally {
      await Contact.deleteOne({ email });
      await mongoose.disconnect();
    }
  },
);
