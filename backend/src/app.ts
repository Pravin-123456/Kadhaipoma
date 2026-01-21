import Fastify from "fastify";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";

const app = Fastify({ logger: true });

app.get("/helth",  async () => {
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

export default app;