import { env } from "@/env";
import { mailTestSchema } from "@/schemas/mail";
import { sendMail } from "@/server/mail/sendMail";
import { testMail } from "@/server/mail/templates/testMail";

// Dev-only: also blocked by src/proxy.ts in production.
export async function POST(request: Request) {
  if (env.NODE_ENV === "production") return new Response(null, { status: 404 });

  const body: unknown = await request.json().catch(() => null);
  const parsed = mailTestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid body, expected { to: string }", details: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const info = await sendMail({ to: parsed.data.to, ...testMail() });
    return Response.json({ status: "sent", messageId: info.messageId });
  } catch (error) {
    console.error("Mail test failed", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to send", details: message }, { status: 502 });
  }
}
