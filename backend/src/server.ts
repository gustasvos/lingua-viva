import "dotenv/config";

import app from "./app";
import { connectRedis } from "./config/redis";

const PORT = Number(process.env.PORT ?? 3000);

const startServer = async (): Promise<void> => {
    try {
        await connectRedis();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`LinguaViva API rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
};

startServer();