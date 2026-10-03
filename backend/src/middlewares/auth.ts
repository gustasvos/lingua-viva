import { type Request, type Response, type NextFunction, } from "express";

import jwt, { type JwtPayload, } from "jsonwebtoken";

import { AppError } from "./error-handler";
import { tokenRevogado } from "../modules/auth/token-blacklist.service";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado.");
}

export interface AuthPayload extends JwtPayload {
    sub: string;
    jti: string;
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(
                "Token não informado.",
                401
            );
        }

        const [scheme, token] =
            authHeader.split(" ");

        if (
            scheme !== "Bearer" ||
            !token
        ) {
            throw new AppError(
                "Token não informado ou formato inválido.",
                401
            );
        }

        const payload = jwt.verify(
            token,
            JWT_SECRET,
            {
                algorithms: ["HS256"],
            }
        ) as AuthPayload;

        if (
            !payload.sub ||
            !payload.jti
        ) {
            throw new AppError(
                "Token inválido.",
                401
            );
        }

        const revogado =
            await tokenRevogado(payload.jti);

        if (revogado) {
            throw new AppError(
                "Token revogado.",
                401
            );
        }

        req.user = payload;

        next();
    } catch (error) {
        next(error);
    }
};