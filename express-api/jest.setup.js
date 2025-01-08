const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeEach(async () => {
    // Clean up the test database before each test
    await prisma.$transaction([
        prisma.notification.deleteMany(),
        prisma.like.deleteMany(),
        prisma.comment.deleteMany(),
        prisma.post.deleteMany(),
        prisma.follow.deleteMany(),
        prisma.user.deleteMany(),
    ]);
});

afterAll(async () => {
    await prisma.$disconnect();
});
