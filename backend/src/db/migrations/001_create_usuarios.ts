import { MigrationBuilder } from "node-pg-migrate";

export const shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createExtension("pgcrypto", {
        ifNotExists: true,
    });

    pgm.createTable("usuarios", {
        id: {
            type: "uuid",
            primaryKey: true,
            notNull: true,
            default: pgm.func("gen_random_uuid()"),
        },

        nome: {
            type: "varchar(100)",
            notNull: true,
        },

        email: {
            type: "varchar(255)",
            notNull: true,
            unique: true,
        },

        senha_hash: {
            type: "text",
            notNull: true,
        },

        criado_em: {
            type: "timestamp with time zone",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP"),
        },

        atualizado_em: {
            type: "timestamp with time zone",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("usuarios");
}