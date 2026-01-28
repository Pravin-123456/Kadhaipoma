import Fastify from "fastify";
import { clerkPlugin } from '@clerk/fastify'
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = Fastify({ logger: true });

app.register(clerkPlugin);

app.get("/api/helth",  async () => {
  return {
    status: "ok",
    message: "server is running",
  };
})

// Auth Route
app.register(authRoutes,{
    prefix: "/api/auth"
});

// Users Route
app.register(userRoutes,{
    prefix: "/api/users"
});

// Chat Route
app.register(chatRoutes,{
    prefix: "/api/chats"
});

// Messages Route
app.register(messageRoutes,{
    prefix: "/api/messages"
});

app.setErrorHandler(errorHandler);

export default app;