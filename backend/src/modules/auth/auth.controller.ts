import { type Request, type Response, type NextFunction } from "express";

import { AppError } from "../../middlewares/error-handler";
import { googleLoginSchema, loginSchema, registerSchema } from "./auth.validation";
import * as authService from "./auth.service";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Dados inválidos.",
                erros: parsed.error.flatten().fieldErrors,
            });
        }

        const usuario = await authService.register(parsed.data);

        return res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
};

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

export const loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = googleLoginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Dados inválidos.",
                erros: parsed.error.flatten().fieldErrors,
            });
        }

        const resultado = await authService.loginWithGoogle(parsed.data.idToken);

        return res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token não informado.",
            });
        }

        const tokens = await authService.refresh(refreshToken);

        return res.status(200).json(tokens);
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

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token não informado.",
            });
        }

        await authService.logout(
            req.user,
            refreshToken
        );

        return res.status(200).json({
            message: "Logout realizado com sucesso.",
        });
    } catch (error) {
        next(error);
    }
};