export interface Usuario {
    id: string;
    nome: string;
    email: string;
    senha_hash: string | null;   // pode ser null em caso de login com google
    auth_provider: "local" | "google";
    google_uid: string | null;
    avatar_url: string | null;
    criado_em: Date;
    atualizado_em: Date;
}

export interface AuthenticatedUser {
    id: string;
    nome: string;
    email: string;
}