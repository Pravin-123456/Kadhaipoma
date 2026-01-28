import type { FastifyInstance } from "fastify";
import { protectRoute } from "../middleware/auth";
import { getMessages } from "../controllers/messageController";

export default async function messageRoutes(app: FastifyInstance) {
  app.get<{
    Params: { chatId: string };
  }>("/chat/:chatId", { preHandler: protectRoute }, getMessages);
}
