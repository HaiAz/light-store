import { PrismaClient } from '@prisma/client';

import { customerCodeRule, productCodeRule } from './seeders/code-rules';
import { adminUser } from './seeders/users';

const prisma = new PrismaClient();

async function main() {
  try {
    const shouldRunCodeRule = (await prisma.codeRule.findFirst({ where: { type: productCodeRule.type } })) === null;
    if (shouldRunCodeRule) {
      await prisma.codeRule.createMany({ data: [ productCodeRule, customerCodeRule ], skipDuplicates: true });
    }

    const shouldRunAdmin = (await prisma.user.findFirst({ where: { email: adminUser.email } })) === null;
    if (shouldRunAdmin) {
      await prisma.user.create({ data: adminUser });
    }
  } catch(error) {
    console.error(`Prisma seeding failed ${error}.`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  
}

main();
