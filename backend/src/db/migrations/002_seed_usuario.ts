import { MigrationBuilder } from "node-pg-migrate";
import bcrypt from "bcryptjs";

export async function up(pgm: MigrationBuilder): Promise<void> {
  const senhaHash = await bcrypt.hash("12345678", 10);

  pgm.sql(`
    INSERT INTO usuarios (nome, email, senha_hash)
    VALUES (
      'Usuário Teste',
      'teste@exemplo.com',
      '${senhaHash}'
    );
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DELETE FROM usuarios
    WHERE email = 'teste@exemplo.com';
  `);
}