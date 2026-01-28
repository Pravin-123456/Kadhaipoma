import { getAuth } from "@clerk/fastify";
import User from "../models/user";
import type { FastifyReply, FastifyRequest } from "fastify";

export interface AuthRequest extends FastifyRequest {
  userId?: string
}

export const protectRoute = async (req: AuthRequest, reply: FastifyReply) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return reply.code(401).send({
        message: "Unauthorized - invalid token",
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return reply.code(404).send({
        message: "User not found",
      });
    }

    req.userId = user._id.toString();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    return reply.code(500).send({
      message: "Internal server error",
    });
  }
};
