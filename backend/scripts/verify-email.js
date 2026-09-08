import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import {smtpOptions, emailFailureReason} from '../services/emailService.js';
dotenv.config({path:new URL('../.env',import.meta.url)});
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('SMTP_HOST, SMTP_USER and SMTP_PASS must be configured in backend/.env.');
  process.exit(1);
}
const transport = nodemailer.createTransport(smtpOptions());
const deadline=setTimeout(()=>{console.error('SMTP verification timed out. Check your network and SMTP port.');transport.close();process.exit(1)},15000);
try {
  await transport.verify();
  console.info('SMTP connection and authentication succeeded. No email was sent.');
} catch(error) {
  console.error(emailFailureReason(error));
  process.exitCode=1;
} finally { clearTimeout(deadline); transport.close(); }
