/* Bootstrap local para ambientes em que o Prisma CLI não consegue executar o schema engine. */
const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const migration = fs.readFileSync(path.join(__dirname, "..", "prisma", "migrations", "20260905000000_init", "migration.sql"), "utf8");
  const statements = migration.split(";").map((sql) => sql.trim()).filter(Boolean);
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON");
  for (const statement of statements) await prisma.$executeRawUnsafe(statement);
  console.log("Banco SQLite pronto em prisma/dev.db");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
