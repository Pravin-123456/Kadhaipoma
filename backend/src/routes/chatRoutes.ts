import type { FastifyInstance } from "fastify";
import { protectRoute } from "../middleware/auth";
import { getChats, getOrCreateChat } from "../controllers/chatController";

export default async function chatRoutes(app: FastifyInstance) {

  // 🔐 Protect everything in this route group
  app.addHook("preHandler", protectRoute);

  app.get("/", getChats);

  app.post("/with/:participantId", getOrCreateChat);
}
