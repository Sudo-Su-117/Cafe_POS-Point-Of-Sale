import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const employeePasswordHash = await bcrypt.hash('Employee@123', 10);

  // Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cafe.com' },
    update: {},
    create: {
      email: 'admin@cafe.com',
      name: 'Admin User',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Admin user created:', adminUser);

  // Create Employee User
  const employeeUser = await prisma.user.upsert({
    where: { email: 'employee@cafe.com' },
    update: {},
    create: {
      email: 'employee@cafe.com',
      name: 'Employee User',
      passwordHash: employeePasswordHash,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Employee user created:', employeeUser);

  console.log('🌱 Database seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
