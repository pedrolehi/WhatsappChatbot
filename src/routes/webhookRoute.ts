import { FastifyInstance } from "fastify";
// import { webhookSchema } from "@/schemas/webhookSchema";
import {
  handleValidation,
  handleWebhook,
} from "@/controller/webhookController";

async function webhookRoutes(server: FastifyInstance) {
  server.get("/v1/webhook", { handler: handleValidation });

  server.post("/v1/webhook", {
    // schema: {
    //   body: webhookSchema,
    // },
    handler: handleWebhook,
  });
}

export default webhookRoutes;
