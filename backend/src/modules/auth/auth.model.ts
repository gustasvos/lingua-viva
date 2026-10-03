export interface Usuario {
    id: string;
    nome: string;
    email: string;
    senha_hash: string;
    criado_em: Date;
    atualizado_em: Date;
}

export interface AuthenticatedUser {
    id: string;
    nome: string;
    email: string;
}