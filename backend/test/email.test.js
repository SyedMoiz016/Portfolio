import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { makeEmailNotifier, smtpOptions, emailFailureReason } from "../services/emailService.js";
import { makeContactController } from "../controllers/contactController.js";
import { createApp } from "../app.js";
const contact = {
  name: "Client",
  email: "client@example.com",
  subject: "Website project",
  service: "Web Development",
  message: "I would like a new website.",
};
test('Gmail App Password display spaces are removed without changing other provider passwords',()=>{
  assert.equal(smtpOptions({SMTP_HOST:'smtp.gmail.com',SMTP_PASS:'abcd efgh ijkl mnop'}).auth.pass,'abcdefghijklmnop');
  assert.equal(smtpOptions({SMTP_HOST:'smtp.example.com',SMTP_PASS:'keep spaces'}).auth.pass,'keep spaces');
});
test('SMTP diagnostics never disclose arbitrary error messages',()=>{
  assert.match(emailFailureReason({code:'EAUTH',message:'secret',response:'secret'}),/authentication rejected/);
  assert.ok(!emailFailureReason({code:'UNKNOWN',message:'secret'}).includes('secret'));
});
test("notification uses fixed sender and recipient, and client Reply-To", async () => {
  let mail, options;
  const notify = makeEmailNotifier({
    env: {
      SMTP_HOST: "smtp.example.com",
      SMTP_USER: "owner@example.com",
      SMTP_PASS: "test-only",
      CONTACT_NOTIFICATION_EMAIL: "recipient@example.com",
    },
    createTransport: (config) => {
      options = config;
      return {
        sendMail: async (data) => {
          mail = data;
          return { accepted: ["recipient@example.com"] };
        },
      };
    },
  });
  assert.deepEqual(await notify(contact), { status: "sent" });
  assert.equal(mail.to, "recipient@example.com");
  assert.equal(mail.from.address, "owner@example.com");
  assert.equal(mail.replyTo.address, contact.email);
  assert.ok(mail.text.includes(contact.message));
  assert.equal(mail.html, undefined);
  assert.equal(options.secure, true);
  assert.equal(options.disableUrlAccess, true);
});
test("missing SMTP credentials do not attempt delivery", async () => {
  const notify = makeEmailNotifier({
    env: {},
    createTransport: () => {
      throw new Error("must not run");
    },
  });
  assert.deepEqual(await notify(contact), { status: "unconfigured" });
});
test("email is attempted only after successful persistence", async () => {
  const order = [];
  const app = createApp({
    controller: makeContactController(
      async () => order.push("saved"),
      async () => {
        order.push("notified");
        return { status: "sent" };
      },
    ),
  });
  assert.equal(
    (await request(app).post("/api/contact").send(contact)).status,
    201,
  );
  assert.deepEqual(order, ["saved", "notified"]);
});
test("SMTP failure preserves successful submission response", async () => {
  let saved = false;
  const app = createApp({
    controller: makeContactController(
      async () => {
        saved = true;
      },
      async () => {
        throw new Error("private SMTP detail");
      },
    ),
  });
  const res = await request(app).post("/api/contact").send(contact);
  assert.equal(saved, true);
  assert.equal(res.status, 201);
  assert.ok(!JSON.stringify(res.body).includes("SMTP"));
});
test("failed database write never triggers email", async () => {
  let notified = false;
  const app = createApp({
    controller: makeContactController(
      async () => {
        throw new Error("database failed");
      },
      async () => {
        notified = true;
      },
    ),
  });
  assert.equal(
    (await request(app).post("/api/contact").send(contact)).status,
    500,
  );
  assert.equal(notified, false);
});
test("recipient rejection is treated as delivery failure", async () => {
  const notify = makeEmailNotifier({
    env: {
      SMTP_HOST: "smtp.example.com",
      SMTP_USER: "owner@example.com",
      SMTP_PASS: "test",
      CONTACT_NOTIFICATION_EMAIL: "recipient@example.com",
    },
    createTransport: () => ({ sendMail: async () => ({ accepted: [] }) }),
  });
  await assert.rejects(notify(contact), /not accepted/);
});
