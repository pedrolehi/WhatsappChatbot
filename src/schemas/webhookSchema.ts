import { z } from "zod";

export const webhookSchema = z.object({
  entry: z.array(
    // Garante que 'entry' é um array
    z.object({
      changes: z.array(
        // Garante que 'changes' é um array
        z.object({
          value: z.object({
            messages: z
              .array(
                // Garante que 'messages' é um array
                z.object({
                  from: z.string(), // Verifica que 'from' é uma string
                  text: z
                    .object({
                      body: z.string(), // Verifica que 'body' é uma string
                    })
                    .optional(), // O campo 'text' pode ser opcional
                })
              )
              .optional(), // 'messages' pode ser opcional
          }),
        })
      ),
    })
  ),
});

export type WebhookInput = z.infer<typeof webhookSchema>;

// Define o schema para a query da requisição
export const validationSchema = z.object({
  "hub.verify_token": z.string(),
  "hub.challenge": z.string(),
});
