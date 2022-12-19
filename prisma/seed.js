const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const main = async () => {
  const admin = await prisma.user.upsert({
    where: { email: 'felipe.vidal@mesquita.rj.gov.br' },
    update: {},
    create: {
      email: 'felipe.vidal@mesquita.rj.gov.br',
      name: 'Felipe Vidal',
      password: await bcrypt.hash('admin', 10),
      role: 'SUPERADMIN',
      updatedAt: null
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect()
    process.exit(1);
  });