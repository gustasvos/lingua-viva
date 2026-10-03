import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

import { AppError } from "../../middlewares/error-handler";
import * as authRepository from "./auth.repository";
import { type LoginDTO } from "./dto/login.dto";
import { revogarToken } from "./token-blacklist.service";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado.");
}

const JWT_EXPIRES_IN_SECONDS = 15 * 60;

export interface LoginResult {
    accessToken: string;
    usuario: {
        id: string;
        nome: string;
        email: string;
    };
}

export const login = async ({ email, senha }: LoginDTO): Promise<LoginResult> => {
    const usuario = await authRepository.findByEmail(email);

    if (!usuario) {
        throw new AppError("Credenciais inválidas.", 401);
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha_hash
    );

    if (!senhaValida) {
        throw new AppError("Credenciais inválidas.", 401);
    }

    const accessToken = jwt.sign(
        {
            sub: usuario.id,
            jti: randomUUID(),
        },
        JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: JWT_EXPIRES_IN_SECONDS,
        }
    );

    return {
        accessToken,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
        },
    };
};

export const logout = async (payload: jwt.JwtPayload): Promise<void> => {
    if (!payload.jti || !payload.exp) {
        return;
    }

    await revogarToken(
        payload.jti,
        payload.exp
    );
};