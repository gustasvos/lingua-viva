import express, { type Express, type Request, type Response } from "express";
import cors from "cors";

import routes from "./routes";
import { errorHandler } from "./middlewares/error-handler";

const app: Express = express();

app.use(cors());

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    return res.status(200).json({
        status: "ok",
        service: "linguaviva-api",
    });
});

app.use(routes);

app.use(errorHandler);

export default app;