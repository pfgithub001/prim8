import type { ContactFormLabels } from "@/components/ContactForm";

export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaLabel: string;
  };
  contact: {
    title: string;
    intro: string;
    form: ContactFormLabels;
  };
};

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "Welcome",
    title: "prim8",
    lead: "A fresh start. Replace this copy in src/content/home.ts.",
    ctaLabel: "Get in touch",
  },
  contact: {
    title: "Contact",
    intro: "Send us a message and we'll get back to you.",
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send message",
      submitting: "Sending…",
    },
  },
};
