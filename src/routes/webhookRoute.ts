import { FastifyInstance } from "fastify";
import { webhookSchema } from "@/schemas/webhookSchema";
import { handleWebhook } from "@/controller/webhookController";

async function webhookRoutes(server: FastifyInstance) {
  server.post("/webhook", {
    // schema: {
    //   body: webhookSchema,
    // },
    handler: handleWebhook,
  });
}

export default webhookRoutes;
