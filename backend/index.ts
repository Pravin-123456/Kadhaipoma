import app from "./src/app";
import { connectDB } from "./src/config/database";
import "dotenv/config";
import dns from "node:dns";


if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}
console.log("MONGO URI 👉", process.env.MONGODB_URI);

const PORT = Number(process.env.PORT) || 3000;

const httpServer = app.server;

initializeSocket(httpServer)

connectDB().then(async() => {
    try {
        await app.listen({
            port:PORT,
            host: "0.0.0.0"
        })
        console.log('server is running on PORT:',PORT);
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
})