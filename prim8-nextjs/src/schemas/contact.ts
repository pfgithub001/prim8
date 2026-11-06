import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.email("Please enter a valid email address").max(254),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = keyof ContactInput;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string[]>>;
};

export const initialContactFormState: ContactFormState = { status: "idle" };
