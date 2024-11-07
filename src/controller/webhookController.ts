import { validationSchema, WebhookInput } from "@/schemas/webhookSchema";
import { getOpenAIResponse } from "@/services/openaiService";
import axios from "axios";
import { FastifyRequest, FastifyReply } from "fastify";

const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PRONE_ID}/messages`;
const VERIFY_TOKEN = "12345678";

export async function handleWebhook(
  request: FastifyRequest<{ Body: WebhookInput }>,
  reply: FastifyReply
) {
  // Log do corpo da requisição
  console.log("Corpo da requisição recebido:", request.body);

  const { messages } = request.body.entry[0].changes[0].value;

  if (messages && messages[0].text) {
    const userMessage = messages[0].text.body;
    const senderNumber = messages[0].from;

    try {
      const replyMessage = await getOpenAIResponse(userMessage); // Serviço OpenAI

      await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: "whatsapp",
          to: senderNumber,
          text: { body: replyMessage },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      reply.status(200).send({ status: "success" });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: "Failed to send message" });
    }
  } else {
    reply.status(400).send({ error: "Invalid message format" });
  }
}

export async function handleValidation(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Valida os parâmetros da query com o schema do Zod
    const queryParams = validationSchema.parse(request.query);

    const { "hub.verify_token": verifyToken, "hub.challenge": challenge } =
      queryParams;

    // Verifica o token de verificação
    if (verifyToken === VERIFY_TOKEN) {
      return reply.send(challenge); // Responde com o challenge para a verificação
    } else {
      return reply.status(403).send("Invalid token."); // Retorna erro se o token for inválido
    }
  } catch (error) {
    // Se a validação falhar, retorna um erro
    return reply.status(400).send({ error: "Invalid request parameters" });
  }
}
