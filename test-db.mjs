import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const count = await prisma.user.count();
  console.log("users:", count);
} catch (e) {
  console.error("DB ERROR:", e.message);
} finally {
  await prisma.$disconnect();
}
