import { type ErrorRequestHandler } from "express";

export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    console.error(error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
        });
    }

    return res.status(500).json({
        message: "Erro interno do servidor.",
    });
};