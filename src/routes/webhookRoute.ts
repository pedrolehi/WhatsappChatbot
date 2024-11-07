import { FastifyInstance } from "fastify";
// import { webhookSchema } from "@/schemas/webhookSchema";
import {
  handleValidation,
  handleWebhook,
} from "@/controller/webhookController";

async function webhookRoutes(server: FastifyInstance) {
  server.get("/webhook", { handler: handleValidation });

  server.post("/webhook", {
    // schema: {
    //   body: webhookSchema,
    // },
    handler: handleWebhook,
  });
}

export default webhookRoutes;
