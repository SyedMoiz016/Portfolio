import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app.js";
import { makeContactController as buildContactController } from "../controllers/contactController.js";
// Never send real emails from tests, even with local SMTP credentials.
const makeContactController = (save) =>
  buildContactController(save, async () => ({ status: "sent" }));
const valid = {
  name: " Test Person ",
  email: "Test@example.com",
  subject: " Portfolio project ",
  service: "Web Development",
  message: "I would like to discuss a new project.",
};
test("health endpoint and security headers", async () => {
  const res = await request(createApp()).get("/api/health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: "ok" });
  assert.ok(res.headers["content-security-policy"]);
  assert.equal(res.headers["x-powered-by"], undefined);
});
test("contact validates, sanitizes, ignores privileged fields and acknowledges after persistence", async () => {
  let saved;
  const app = createApp({
    controller: makeContactController(async (data) => {
      saved = data;
      return { id: "one" };
    }),
  });
  const res = await request(app)
    .post("/api/contact")
    .send({
      ...valid,
      status: "closed",
      createdAt: "2001-01-01",
      unknown: "discard",
    });
  assert.equal(res.status, 201);
  assert.equal(saved.name, "Test Person");
  assert.equal(saved.email, "test@example.com");
  assert.equal(saved.status, undefined);
  assert.equal(saved.createdAt, undefined);
  assert.equal(saved.unknown, undefined);
  assert.equal(res.body.message, "Your message has been received.");
});
test("invalid fields never reach persistence", async () => {
  let called = false;
  const app = createApp({
    controller: makeContactController(async () => {
      called = true;
    }),
  });
  const res = await request(app).post("/api/contact").send({
    name: "x",
    email: "invalid",
    service: "malicious",
    subject: "",
    message: "short",
  });
  assert.equal(res.status, 422);
  assert.equal(res.body.errors.length, 5);
  assert.equal(called, false);
});
test("rejects object-based injection", async () => {
  const res = await request(createApp())
    .post("/api/contact")
    .send({ ...valid, email: { $gt: "" } });
  assert.equal(res.status, 422);
});
test("CORS allows configured origin and rejects other origin", async () => {
  const app = createApp({ origins: "https://portfolio.example" });
  const good = await request(app)
    .get("/api/health")
    .set("Origin", "https://portfolio.example");
  assert.equal(
    good.headers["access-control-allow-origin"],
    "https://portfolio.example",
  );
  const bad = await request(app)
    .get("/api/health")
    .set("Origin", "https://other.example");
  assert.equal(bad.status, 403);
});
test("malformed and oversized JSON return JSON errors", async () => {
  const app = createApp();
  const malformed = await request(app)
    .post("/api/contact")
    .set("Content-Type", "application/json")
    .send("{");
  assert.equal(malformed.status, 400);
  const huge = await request(app)
    .post("/api/contact")
    .send({ ...valid, message: "a".repeat(20000) });
  assert.equal(huge.status, 413);
});
test("contact rate limit returns actionable error", async () => {
  const app = createApp({
    contactLimit: 1,
    controller: makeContactController(async () => ({})),
  });
  assert.equal(
    (await request(app).post("/api/contact").send(valid)).status,
    201,
  );
  const res = await request(app).post("/api/contact").send(valid);
  assert.equal(res.status, 429);
  assert.match(res.body.message, /15 minutes/);
  assert.ok(res.headers["retry-after"]);
});
test("database outage does not claim success or leak internals", async () => {
  const app = createApp({
    controller: makeContactController(async () => {
      const err = new Error("secret connection string");
      err.name = "MongoNetworkError";
      throw err;
    }),
  });
  const res = await request(app).post("/api/contact").send(valid);
  assert.equal(res.status, 503);
  assert.match(res.body.message, /temporarily unavailable/);
  assert.ok(!JSON.stringify(res.body).includes("secret"));
});
test("unsupported media and unknown route are handled", async () => {
  const app = createApp();
  assert.equal(
    (await request(app).post("/api/contact").type("text").send("hi")).status,
    415,
  );
  assert.equal((await request(app).get("/api/missing")).status, 404);
});
