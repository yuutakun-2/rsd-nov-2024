const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth } = require("../middlewares/auth");

const { clients } = require("./ws");

router.post("/posts/:id/comments", auth, async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const user = res.locals.user;

  try {
    const comment = await prisma.comment.create({
      data: {
        postId: parseInt(postId),
        userId: Number(user.id),
        content,
      },
      include: {
        user: true,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
      include: {
        user: true,
      },
    });

    clients.map((client) => {
      if (client.userId == post.user.id) {
        client.ws.send(JSON.stringify({ event: "notis" }));
        console.log(`WS: event sent to ${client.userId}: comment`);
      }
    });

    if (post.userId !== user.id) {
      const noti = await prisma.notification.create({
        data: {
          type: "comment",
          postId: Number(postId),
          userId: Number(post.userId),
          actorId: user.id,
          read: false,
        },
      });
    }

    res.json(comment);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/comments/:id", auth, async (req, res) => {
  const commentId = req.params.id;
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(commentId),
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (res.locals.user.id !== comment.userId) {
      //   return res.status(403).json({ error: "Not authorized" });
      return res.json(auth.id);
    }

    await prisma.comment.delete({
      where: {
        id: parseInt(commentId),
      },
    });

    res.json({ message: "Deleted comment successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { commentsRouter: router };
