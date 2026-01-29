import { verifyToken } from "@clerk/fastify";
import type { Server as HttpServer } from "node:http";
import { Server as SocketIOServer, Socket } from "socket.io";
import User from "../models/user";
import Chat from "../models/chat";
import Message from "../models/message";

interface SocketWithUserId extends Socket {
  userId: string;
}

export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        "http://localhost:8081",
        "http://localhost:5173",
        process.env.FRONTEND_URL!,
      ],
      credentials: true,
    },
  });

  // 🔐 Auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication token missing"));

      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      const user = await User.findOne({ clerkId: session.sub });
      if (!user) return next(new Error("User not found"));

      (socket as SocketWithUserId).userId = user._id.toString();
      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as SocketWithUserId).userId;

    console.log("🔌 User connected:", userId);

    // Join personal room
    socket.join(`user:${userId}`);

    // Track online user
    onlineUsers.set(userId, socket.id);

    // Notify everyone
    io.emit("user-online", { userId });

    // Send current online users to this socket
    socket.emit("online-users", {
      users: Array.from(onlineUsers.keys()),
    });

    // Join chat room
    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    // 💬 Send message
    socket.on(
      "send-message",
      async ({ chatId, text }: { chatId: string; text: string }) => {
        if (!text?.trim()) return;

        const chat = await Chat.findOne({
          _id: chatId,
          participants: userId,
        });

        if (!chat) {
          socket.emit("socket-error", { message: "Chat not found" });
          return;
        }

        const message = await Message.create({
          chat: chatId,
          sender: userId,
          text,
        });

        chat.lastMessage = message._id;
        chat.lastMessageAt = new Date();
        await chat.save();

        await message.populate("sender", "name email avatar");

        // Emit to chat room only
        io.to(`chat:${chatId}`).emit("new-message", message);
      }
    );

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user-offline", { userId });
      console.log("❌ User disconnected:", userId);
    });
  });

  return io;
};
