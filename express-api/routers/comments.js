const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth, isOwner } = require("../middlewares/auth");
const { addNoti } = require("./noti.js");

router.post("/posts/:id/comments", auth, async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const userId = Number(res.locals.user.id);

  try {
    const comment = await prisma.comment.create({
      data: {
        postId: parseInt(postId),
        userId,
        content,
      },
      include: {
        user: true,
      },
    });

    await addNoti({
      type: "comment",
      content: "replied to your post",
      postId,
      userId,
    });
    console.log("Add noti successfully");

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
