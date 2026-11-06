import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { env } from "@/env";

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  });
  return transporter;
}

export type MailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendMail(input: MailInput) {
  return getTransporter().sendMail({ from: env.SMTP_FROM, ...input });
}
