const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.post.deleteMany({
    where: { userId: 1 },
  });
  await prisma.user.delete({
    where: {
      id: 1,
    },
  });

  console.log(user);
}

main();
