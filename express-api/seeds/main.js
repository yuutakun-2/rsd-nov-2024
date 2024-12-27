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
    const userId = faker.number.int({ min: 1, max: 10 });

    await prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    });
  }
}

main();
