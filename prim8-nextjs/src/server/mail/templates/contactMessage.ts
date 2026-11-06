import "server-only";
import { siteName } from "@/constants/site";
import { escapeHtml } from "@/lib/escapeHtml";
import type { ContactInput } from "@/schemas/contact";
import type { MailContent } from "./types";

export function contactMessage({ name, email, message }: ContactInput): MailContent {
  return {
    subject: `[${siteName}] New message from ${name}`,
    html: [
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Message:</strong></p>`,
      `<p style="white-space: pre-wrap">${escapeHtml(message)}</p>`,
    ].join("\n"),
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };
}
