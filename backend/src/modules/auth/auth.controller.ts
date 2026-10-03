import { type Request, type Response, type NextFunction } from "express";

import { AppError } from "../../middlewares/error-handler";
import { loginSchema } from "./auth.validation";
import * as authService from "./auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = loginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Dados inválidos.",
                erros: parsed.error.flatten().fieldErrors,
            });
        }

        const resultado = await authService.login(
            parsed.data
        );

        return res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new AppError(
                "Usuário não autenticado.",
                401
            );
        }

        await authService.logout(req.user);

        return res.status(200).json({
            message: "Logout realizado com sucesso.",
        });
    } catch (error) {
        next(error);
    }
};