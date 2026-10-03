import { redis } from "../../config/redis";

const BLACKLIST_PREFIX = "jwt:blacklist:";

export const revogarToken = async (jti: string, exp: number): Promise<void> => {
    const agora = Math.floor(Date.now() / 1000);

    const ttl = exp - agora;

    if (ttl <= 0) {
        return;
    }

    await redis.set(
        `${BLACKLIST_PREFIX}${jti}`,
        "revoked",
        {
            EX: ttl,
        }
    );
};

export const tokenRevogado = async (jti: string): Promise<boolean> => {
    const result = await redis.exists(
        `${BLACKLIST_PREFIX}${jti}`
    );

    return result === 1;
};