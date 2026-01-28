import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthRequest } from "../middleware/auth";
import User from "../models/user";
import { clerkClient, getAuth } from "@clerk/fastify";

/* =======================
   GET CURRENT USER
======================= */
export const getMe = async (req: AuthRequest, reply: FastifyReply) => {
  const userId = req.userId;

  if (!userId) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }

  const user = await User.findById(userId);

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return reply.send(user);
};

/* =======================
   AUTH CALLBACK (CLERK)
======================= */
export const authCallback = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }

  let user = await User.findOne({ clerkId });

  if (!user) {
    const clerkUser = await clerkClient.users.getUser(clerkId);

    user = await User.create({
      clerkId,
      name: clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
        : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
      email: clerkUser.emailAddresses[0]?.emailAddress,
      avatar: clerkUser.imageUrl,
    });
  }

  return reply.send(user);
};
