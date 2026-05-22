import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "admin@nexus.dev" } });
  if (existing) {
    console.log("Super admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash("Admin@1234", 12);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@nexus.dev",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Super admin created: admin@nexus.dev / Admin@1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
