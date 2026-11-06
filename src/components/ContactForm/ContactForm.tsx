"use client";

import { useActionState } from "react";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import type { ContactFormState } from "@/schemas/contact";
import { submitContact } from "@/server/contact/actions";
import styles from "./ContactForm.module.scss";

export type ContactFormLabels = {
  name: string;
  email: string;
  message: string;
  submit: string;
  submitting: string;
};

type Props = {
  labels: ContactFormLabels;
};

const initialState: ContactFormState = { status: "idle" };

export function ContactForm({ labels }: Props) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className={styles.form} noValidate>
      <TextField
        name="name"
        label={labels.name}
        autoComplete="name"
        required
        errors={errors?.name}
      />
      <TextField
        name="email"
        label={labels.email}
        type="email"
        autoComplete="email"
        required
        errors={errors?.email}
      />
      <TextField
        name="message"
        label={labels.message}
        multiline
        rows={6}
        required
        errors={errors?.message}
      />
      <div className={styles.footer}>
        <Button type="submit" disabled={pending}>
          {pending ? labels.submitting : labels.submit}
        </Button>
        <p
          role="status"
          className={state.status === "error" ? styles.error : styles.success}
          aria-live="polite"
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
