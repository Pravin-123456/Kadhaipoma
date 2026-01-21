import app from "./src/app";
import { connectDB } from "./src/config/database";


const PORT = Number(process.env.PORT) || 3000

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