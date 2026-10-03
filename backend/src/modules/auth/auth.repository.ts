import { pool } from "../../config/db";
import { Usuario } from "./auth.model";

export const findByEmail = async (email: string): Promise<Usuario | null> => {
    const result = await pool.query<Usuario>(
        `SELECT
            id,
            nome,
            email,
            senha_hash,
            criado_em,
            atualizado_em
        FROM usuarios
        WHERE email = $1
        LIMIT 1`,
        [email]
    );

    return result.rows[0] ?? null;
};