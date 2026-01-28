import type { FastifyInstance } from "fastify";
import { protectRoute } from "../middleware/auth";
import { getUsers } from "../controllers/userController";

export default async function userRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: protectRoute }, getUsers);
}
