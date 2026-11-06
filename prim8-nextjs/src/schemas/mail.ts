import { z } from "zod";

export const mailTestSchema = z.object({
  to: z.email(),
});
