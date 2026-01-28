import type { FastifyInstance } from "fastify";
import { protectRoute } from "../middleware/auth";
import { authCallback, getMe } from "../controllers/authController";

export default async function authRoutes(app: FastifyInstance) {
  app.get('/me',{ preHandler: protectRoute } , getMe);

  app.post("/callback", authCallback)
}
