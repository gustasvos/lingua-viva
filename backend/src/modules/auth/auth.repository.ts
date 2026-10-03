import { pool } from "../../config/db";
import { Usuario } from "./auth.model";

export const createUser = async (nome: string, email: string, senhaHash: string): Promise<Usuario> => {
    const result = await pool.query<Usuario>(
        `
      INSERT INTO usuarios (nome, email, senha_hash)
      VALUES ($1, $2, $3)
      RETURNING
        id,
        nome,
        email,
        senha_hash,
        criado_em,
        atualizado_em
    `,
        [nome, email, senhaHash]
    );

    return result.rows[0];
};

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
