const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
async function main() {
  console.log("User seeding started...");
  for (i = 0; i < 5; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = await bcrypt.hash("password", 10);

    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        username: `${firstName}${lastName[0]}`.toLowerCase(),
        password: password,
      },
    });
  }

  console.log("Post seeding started...");
  for (i = 0; i < 5; i++) {
    const title = faker.lorem.word();
    const content = faker.lorem.paragraph();
    const userId = faker.number.int({ min: 1, max: 5 });

    await prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    });
  }

  console.log("Comment seeding started...");
  // Add 2-4 comments for each post
  const posts = await prisma.post.findMany();
  for (const post of posts) {
    const numComments = faker.number.int({ min: 2, max: 4 });
    for (let i = 0; i < numComments; i++) {
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          userId: faker.number.int({ min: 1, max: 5 }),
          postId: post.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
