import { z } from "zod";

export const AddWordToListValidator = z.object({
  word: z.string().min(1).max(100),
  customDescription: z.string().min(1).max(300),
  found: z.string().max(300).optional(),
});

export type AddWordToListCredentials = z.infer<typeof AddWordToListValidator>;
