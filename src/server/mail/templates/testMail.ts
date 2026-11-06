import "server-only";
import { siteName } from "@/constants/site";
import type { MailContent } from "./types";

export function testMail(): MailContent {
  const sentAt = new Date().toISOString();
  return {
    subject: `[${siteName}] SMTP test`,
    html: `<p>This is a test email from <strong>${siteName}</strong>.</p><p>Sent at ${sentAt}.</p>`,
    text: `This is a test email from ${siteName}.\n\nSent at ${sentAt}.`,
  };
}
