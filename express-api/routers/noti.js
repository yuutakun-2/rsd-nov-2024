const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addNoti({ type, content, postId, actorId }) {
  const userId = res.locals.user.id;
  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (post.userId == userId) return false;

  try {
    return await prisma.notification.create({
      data: {
        type,
        content,
        postId: Number(postId),
        userId: Number(userId),
        actorId,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { addNoti };
