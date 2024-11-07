import { string, z } from "zod";

export const openAIResponseSchema = z
  .string()
  .min(1, "Answer must not be empty.");

export type OpenAIResponse = z.infer<typeof openAIResponseSchema>;
