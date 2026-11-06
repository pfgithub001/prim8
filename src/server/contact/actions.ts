"use server";

import { z } from "zod";
import { env } from "@/env";
import { contactSchema, type ContactFormState } from "@/schemas/contact";
import { sendMail } from "@/server/mail/sendMail";
import { contactMessage } from "@/server/mail/templates/contactMessage";

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await sendMail({
      to: env.CONTACT_TO,
      replyTo: parsed.data.email,
      ...contactMessage(parsed.data),
    });
  } catch (error) {
    console.error("Contact form: failed to send mail", error);
    return { status: "error", message: "Your message couldn't be sent. Please try again later." };
  }

  return { status: "success", message: "Thanks! Your message has been sent." };
}
