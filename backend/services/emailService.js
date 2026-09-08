import nodemailer from "nodemailer";

export function smtpOptions(env = process.env) {
  const host = (env.SMTP_HOST || '').trim();
  const port = Number(env.SMTP_PORT || 465);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('Invalid SMTP port');
  return {
    host, port, secure: port === 465, requireTLS: port !== 465,
    auth: {user: (env.SMTP_USER || '').trim(), pass: host.toLowerCase() === 'smtp.gmail.com' ? (env.SMTP_PASS || '').replace(/\s/g, '') : env.SMTP_PASS},
    connectionTimeout: 4000, greetingTimeout: 4000, socketTimeout: 5000,
    disableFileAccess: true, disableUrlAccess: true,
  };
}

// Only return known codes and fixed guidance, never the SMTP response or credentials.
export function emailFailureReason(error) {
  const reasons = {
    EAUTH: 'Gmail authentication rejected. Check that the App Password belongs to SMTP_USER and has not been revoked.',
    ETIMEDOUT: 'SMTP connection timed out. Check network access to the SMTP port.',
    ECONNECTION: 'Unable to connect to the SMTP server. Check the host, port and firewall.',
    ESOCKET: 'SMTP connection or TLS failed. Check network access and certificate configuration.',
    EDNS: 'SMTP hostname could not be resolved. Check DNS and SMTP_HOST.',
    EENVELOPE: 'The SMTP server rejected the sender or recipient.',
  };
  return reasons[error?.code] || 'SMTP delivery failed. Run npm run email:verify for a connection check.';
}

// Configure the sender server-side; visitors can only set Reply-To.
export function makeEmailNotifier({
  env = process.env,
  createTransport = nodemailer.createTransport,
} = {}) {
  let transport;
  return async function notifyContact(contact) {
    if (
      !env.SMTP_HOST ||
      !env.SMTP_USER ||
      !env.SMTP_PASS ||
      !env.CONTACT_NOTIFICATION_EMAIL
    ) {
      return { status: "unconfigured" };
    }
    transport ||= createTransport(smtpOptions(env));
    let timer;
    const delivery = transport.sendMail({
      from: { name: "SMK Portfolio", address: env.SMTP_USER },
      to: env.CONTACT_NOTIFICATION_EMAIL,
      replyTo: { name: contact.name, address: contact.email },
      subject: `New portfolio inquiry: ${contact.subject.replace(/[\r\n]/g, " ")}`,
      text: [
        "A new client message has been saved in your portfolio database.",
        "",
        `Name: ${contact.name}`,
        `Email: ${contact.email}`,
        `Service: ${contact.service}`,
        `Subject: ${contact.subject}`,
        "",
        "Message:",
        contact.message,
        "",
        "Reply to this email to respond directly to the client.",
      ].join("\n"),
    });
    let result;
    try {
      result = await Promise.race([
        delivery,
        new Promise((_, reject) => {
          timer = setTimeout(
            () => reject(Object.assign(new Error("SMTP notification timed out"), {code:'ETIMEDOUT'})),
            9000,
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
    if (!result.accepted?.length)
      throw new Error("Notification recipient was not accepted");
    return { status: "sent" };
  };
}
export const notifyContact = makeEmailNotifier();
