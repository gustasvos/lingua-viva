import { pool } from "../../config/db";
import { Usuario } from "./auth.model";

const SELECT_FIELDS = `
    id,
    nome,
    email,
    senha_hash,
    auth_provider,
    google_uid,
    avatar_url,
    criado_em,
    atualizado_em
`;

export const createUser = async (nome: string, email: string, senhaHash: string): Promise<Usuario> => {
    const result = await pool.query<Usuario>(
        `
      INSERT INTO usuarios (nome, email, senha_hash)
      VALUES ($1, $2, $3)
      RETURNING ${SELECT_FIELDS}
    `,
        [nome, email, senhaHash]
    );

    return result.rows[0];
};

export const createGoogleUser = async (
    nome: string,
    email: string,
    googleUid: string,
    avatarUrl?: string | null
): Promise<Usuario> => {
    const result = await pool.query<Usuario>(
        `
      INSERT INTO usuarios (nome, email, senha_hash, auth_provider, google_uid, avatar_url)
      VALUES ($1, $2, NULL, 'google', $3, $4)
      RETURNING ${SELECT_FIELDS}
    `,
        [nome, email, googleUid, avatarUrl ?? null]
    );

    return result.rows[0];
};

export const linkGoogleAccount = async (id: string, googleUid: string): Promise<Usuario> => {
    const result = await pool.query<Usuario>(
        `
      UPDATE usuarios
      SET google_uid = $2,
          atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING ${SELECT_FIELDS}
    `,
        [id, googleUid]
    );

    return result.rows[0];
};

export const findByEmail = async (email: string): Promise<Usuario | null> => {
    const result = await pool.query<Usuario>(
        `SELECT ${SELECT_FIELDS}
        FROM usuarios
        WHERE email = $1
        LIMIT 1`,
        [email]
    );

    return result.rows[0] ?? null;
};