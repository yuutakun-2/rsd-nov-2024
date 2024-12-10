const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Hehe",
      username: "Hehe1",
      email: "hehe@gmail.com",
      password: "password",
      posts: {
        create: [
          { content: "Hehe's second content" },
          { content: "Hehe's second content" },
        ],
      },
    },
  });

  console.log(user);
}

main();
