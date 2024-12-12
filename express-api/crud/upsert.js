const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: {
      id: 2,
    },
    data: {
      name: "Hehe changed",
    },
  });

  const upsertUser = await prisma.user.upsert({
    where: {
      email: "viola@prisma.io",
    },
    update: {
      name: "Viola the Magnificent",
    },
    create: {
      email: "viola@prisma.io",
      name: "Viola the Magnificent",
      username: "username",
      password: "password",
    },
  });

  console.log(upsertUser);
}

main();
