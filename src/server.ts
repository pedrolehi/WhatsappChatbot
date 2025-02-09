import "tsconfig-paths/register";
import Fastify from "fastify";
import "dotenv/config";
import webhookRoutes from "@/routes/webhookRoute";

const server = Fastify({ logger: true });

server.register(webhookRoutes);

const port = process.env.PORT;

server.listen({ port: Number(port), host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening ton ${address}`);
});

export default server;
