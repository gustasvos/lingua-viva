import { MigrationBuilder } from "node-pg-migrate";

export const shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("usuarios", {
        auth_provider: {
            type: "varchar(20)",
            notNull: true,
            default: "local",
        },
        google_uid: {
            type: "varchar(255)",
            unique: true,
        },
        avatar_url: {
            type: "text",
        },
    });

    // Usuário que se cadastra pelo Google não tem senha.
    pgm.alterColumn("usuarios", "senha_hash", {
        notNull: false,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.alterColumn("usuarios", "senha_hash", {
        notNull: true,
    });

    pgm.dropColumns("usuarios", ["auth_provider", "google_uid", "avatar_url"]);
}