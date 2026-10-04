import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("E-mail inválido.")
        .transform((value) => value.trim().toLowerCase()),

    senha: z
        .string()
        .min(1, "Senha obrigatória."),
});

export const googleLoginSchema = z.object({
    idToken: z
        .string()
        .min(1, "Token do Google obrigatório."),
});

export const registerSchema = z.object({
    nome: z
        .string()
        .min(2, "Nome deve possuir pelo menos 2 caracteres.")
        .max(100),

    email: z
        .string()
        .email("E-mail inválido.")
        .transform((value) => value.trim().toLowerCase()),

    senha: z
        .string()
        .min(8, "A senha deve possuir pelo menos 8 caracteres."),
});