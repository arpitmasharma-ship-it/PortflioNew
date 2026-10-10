import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

function createTransport() {
  if (!env.smtp.host || !env.smtp.user) return null;
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

export async function sendContactNotification(message) {
  const transporter = createTransport();
  const to = env.contactNotifyEmail || env.smtp.user;
  if (!transporter || !to) {
    console.warn('Email not configured; contact stored without notification.');
    return { sent: false };
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    replyTo: message.email,
    subject: `Portfolio contact: ${message.subject}`,
    text: [
      `From: ${message.name} <${message.email}>`,
      `Type: ${message.inquiryType}`,
      '',
      message.message,
    ].join('\n'),
  });

  return { sent: true };
}
