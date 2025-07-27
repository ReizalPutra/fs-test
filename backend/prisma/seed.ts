import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv'; // Import dotenv

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Ambil username dan password dari variabel lingkungan
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'; // Default ke 'admin' jika tidak ada di .env
  const adminPassword = process.env.ADMIN_PASSWORD || "password12345";

  if (!adminPassword) {
    console.error('❌ Error: ADMIN_PASSWORD environment variable is not set.');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {
      password: hashedPassword, // Perbarui password jika user sudah ada
    },
    create: {
      username: adminUsername,
      password: hashedPassword,
    },
  });
  console.log(`✅ User '${adminUsername}' seeded successfully`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
