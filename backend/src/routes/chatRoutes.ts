import type { FastifyInstance } from "fastify";

export default async function chatRoutes(app: FastifyInstance) {
  app.post("/login", async () => {
    return { message: "login route" };
  });

  app.post("/register", async () => {
    return { message: "register route" };
  });
}
