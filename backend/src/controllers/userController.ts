import type { FastifyReply } from "fastify";
import type { AuthRequest } from "../middleware/auth";
import User from "../models/user";

export const getUsers = async (req: AuthRequest, res: FastifyReply) => {
  const userId = req.userId;

  if (!userId) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }

  const users = await User.find({
    _id: { $ne: userId },
  })
    .select("name email avatar")
    .limit(50);

  return res.send(users);
};
