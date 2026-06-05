import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@notes.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@notes.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Seeded admin user: admin@notes.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
