import { validationSchema, WebhookInput } from "@/schemas/webhookSchema";
import { getOpenAIResponse } from "@/services/openaiService";
import { sendWhatsAppMessage } from "@/services/whatsappService"; // Importa o serviço de envio de mensagens
import { FastifyRequest, FastifyReply } from "fastify";

const VERIFY_TOKEN = "12345678"; // Token de verificação

// Função para lidar com mensagens recebidas pelo webhook
export async function handleWebhook(
  request: FastifyRequest<{ Body: WebhookInput }>,
  reply: FastifyReply
) {
  const { messages } = request.body.entry[0].changes[0].value;

  if (messages && messages[0].text) {
    const userMessage = messages[0].text.body;
    const senderNumber = messages[0].from;

    try {
      // Chama o serviço OpenAI para gerar a resposta
      const replyMessage = await getOpenAIResponse(userMessage);

      // Chama o serviço de envio de mensagens para enviar a resposta ao usuário
      await sendWhatsAppMessage(senderNumber, replyMessage);

      reply.status(200).send({ status: "success" });
    } catch (error) {
      request.log.error("Erro ao enviar mensagem:", error);
      reply.status(500).send({ error: "Failed to send message" });
    }
  } else {
    reply.status(400).send({ error: "Invalid message format" });
  }
}

// Função para lidar com a validação do webhook
export async function handleValidation(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Valida os parâmetros da query usando o Zod
    const queryParams = validationSchema.parse(request.query);

    const { "hub.verify_token": verifyToken, "hub.challenge": challenge } =
      queryParams;

    // Verifica o token de verificação
    if (verifyToken === VERIFY_TOKEN) {
      return reply.send(challenge); // Responde com o desafio para a verificação
    } else {
      return reply.status(403).send("Invalid token."); // Retorna erro se o token for inválido
    }
  } catch (error) {
    // Retorna erro se a validação falhar
    return reply.status(400).send({ error: "Invalid request parameters" });
  }
}
