import "tsconfig-paths/register";
import Fastify from "fastify";
import "dotenv/config";
import webhookRoutes from "@/routes/webhookRoute";

const server = Fastify({ logger: true });

server.register(webhookRoutes);

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening ton ${address}`);
});
