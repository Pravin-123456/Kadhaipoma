import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthRequest } from "../middleware/auth";
import Chat from "../models/chat";
import Message from "../models/message";

interface GetMessagesParams {
  chatId: string;
}


export const getMessages = async (
  req: FastifyRequest<{ Params: GetMessagesParams }> & AuthRequest,
  reply: FastifyReply
) => {
  const userId = req.userId;
  const { chatId } = req.params;

  if (!userId) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  });

  if (!chat) {
    throw Object.assign(new Error("Chat not found"), { statusCode: 404 });
  }

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email avatar")
    .sort({ createdAt: 1 });

  return reply.send(messages);
};
