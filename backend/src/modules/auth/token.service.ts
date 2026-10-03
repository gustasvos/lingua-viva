import crypto from "crypto";
import jwt from "jsonwebtoken";

import { redis } from "../../config/redis";
import { AppError } from "../../middlewares/error-handler";

const JWT_SECRET = process.env.JWT_SECRET!;

const ACCESS_TOKEN_EXPIRES_IN = 15 * 60;
const REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60;

const REFRESH_PREFIX = "auth:refresh:";

export interface AccessTokenPayload extends jwt.JwtPayload {
    sub: string;
    jti: string;
}

export const generateAccessToken = (userId: string): string => {
    return jwt.sign(
        {
            sub: userId,
            jti: crypto.randomUUID(),
        },
        JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        }
    );
};

export const generateRefreshToken = async (userId: string): Promise<string> => {
    const token = crypto.randomBytes(64).toString("hex");

    await redis.set(
        `${REFRESH_PREFIX}${token}`,
        userId,
        {
            EX: REFRESH_TOKEN_EXPIRES_IN,
        }
    );

    return token;
};

export const rotateRefreshToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string; }> => {
    const key = `${REFRESH_PREFIX}${refreshToken}`;

    const userId = await redis.get(key);

    if (!userId) {
        throw new AppError("Refresh token inválido ou expirado.", 401);
    }

    // Revoga o refresh token antigo
    await redis.del(key);

    const accessToken = generateAccessToken(userId);
    const newRefreshToken = await generateRefreshToken(userId);

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};

export const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
    await redis.del(`${REFRESH_PREFIX}${refreshToken}`);
};