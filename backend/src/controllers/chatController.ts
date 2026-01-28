import type { FastifyReply } from "fastify";
import type { AuthRequest } from "../middleware/auth";
import Chat from "../models/chat";

export const getChats = async (req: AuthRequest, reply: FastifyReply) => {
  const userId = req.userId;

  if (!userId) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }

  const chats = await Chat.find({
    participants: userId,
  })
    .populate("participants", "name email avatar")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });

  const formattedChats = chats.map(chat => {
    const otherParticipant = chat.participants.find(
      (p: any) => p._id.toString() !== userId
    );

    return {
      _id: chat._id,
      participant: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    };
  });

  return reply.send(formattedChats);
};

export const getOrCreateChat = async (
  req: AuthRequest,
  reply: FastifyReply
) => {
  const userId = req.userId;
  const { participantId } = req.params as { participantId: string };

  if (!userId) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }

  if (userId === participantId) {
    throw Object.assign(
      new Error("Cannot create chat with yourself"),
      { statusCode: 400 }
    );
  }

  let chat = await Chat.findOne({
    participants: { $all: [userId, participantId] },
  })
    .populate("participants", "name email avatar")
    .populate("lastMessage");

  if (!chat) {
    chat = await Chat.create({
      participants: [userId, participantId],
    });

    chat = await chat.populate("participants", "name email avatar");
  }

  const otherParticipant = chat.participants.find(
    (p: any) => p._id.toString() !== userId
  );

  return reply.send({
    _id: chat._id,
    participant: otherParticipant ?? null,
    lastMessage: chat.lastMessage,
    lastMessageAt: chat.lastMessageAt,
    createdAt: chat.createdAt,
  });
};