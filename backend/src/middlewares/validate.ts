import { type RequestHandler } from "express";

import { type ZodType, } from "zod";

export const validateBody = (schema: ZodType): RequestHandler => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Dados inválidos.",
                erros: result.error.flatten().fieldErrors,
            });
        }

        req.body = result.data;

        next();
    };
};