import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AppError } from "../../middlewares/error-handler";
import * as authRepository from "./auth.repository";
import { type LoginDTO } from "./dto/login.dto";
import { type RegisterDTO } from "./dto/register.dto";
import { revogarToken } from "./token-blacklist.service";
import { generateAccessToken, generateRefreshToken, rotateRefreshToken, revokeRefreshToken } from "./token.service";
import { firebaseAuth } from "../../config/firebase-admin";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado.");
}

const JWT_EXPIRES_IN_SECONDS = 15 * 60;

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    usuario: {
        id: string;
        nome: string;
        email: string;
        avatarUrl: string | null;
    };
}

export interface GoogleLoginResult extends LoginResult { }

export const register = async ({ nome, email, senha }: RegisterDTO): Promise<{ id: string; nome: string; email: string; }> => {
    const usuarioExistente = await authRepository.findByEmail(email);

    if (usuarioExistente) {
        throw new AppError("E-mail já cadastrado.", 409);
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await authRepository.createUser(
        nome,
        email,
        senhaHash
    );

    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
    };
};

export const login = async ({ email, senha }: LoginDTO): Promise<LoginResult> => {
    const usuario = await authRepository.findByEmail(email);

    if (!usuario || !usuario.senha_hash) {
        throw new AppError("Credenciais inválidas.", 401);
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha_hash
    );

    if (!senhaValida) {
        throw new AppError("Credenciais inválidas.", 401);
    }

    const accessToken = generateAccessToken(usuario.id);
    const refreshToken = await generateRefreshToken(usuario.id);

    return {
        accessToken,
        refreshToken,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            avatarUrl: usuario.avatar_url,
        },
    };
};

export const loginWithGoogle = async (idToken: string): Promise<GoogleLoginResult> => {
    let decoded;
    try {
        decoded = await firebaseAuth.verifyIdToken(idToken);
    } catch {
        throw new AppError("Token do Google inválido ou expirado.", 401);
    }

    const { email, name, picture, uid } = decoded;

    if (!email) {
        throw new AppError("Conta do Google sem e-mail associado.", 400);
    }

    let usuario = await authRepository.findByEmail(email);

    if (!usuario) {
        usuario = await authRepository.createGoogleUser(
            name ?? email.split("@")[0],
            email,
            uid,
            picture
        );
    } else if (!usuario.google_uid) {
        // e-mail já existia (cadastro normal) — vincula a conta Google a ele
        usuario = await authRepository.linkGoogleAccount(usuario.id, uid);
    }

    const accessToken = generateAccessToken(usuario.id);
    const refreshToken = await generateRefreshToken(usuario.id);

    return {
        accessToken,
        refreshToken,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            avatarUrl: usuario.avatar_url,
        },
    };
};

export const refresh = async (refreshToken: string) => {
    return rotateRefreshToken(refreshToken);
};

export const logout = async (payload: jwt.JwtPayload, refreshToken: string): Promise<void> => {
    if (payload.jti && payload.exp) {
        await revogarToken(
            payload.jti,
            payload.exp
        )
    }

    await revokeRefreshToken(refreshToken)
};
