const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const { clients } = require("./ws");

// const { addNoti } = require("./noti");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth, isOwner } = require("../middlewares/auth");

router.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          id: "desc",
        },
      },
    },
    take: 20,
    orderBy: { id: "desc" },
  });

  return res.json(posts);
});

router.get("/posts/:id", async (req, res) => {
  const { id } = req.params; // {id} is to accept other parameters from the user's input
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          id: "desc",
        },
      },
    },
  });

  res.json(post);
});

router.post("/posts", auth, async (req, res) => {
  const { content } = req.body;
  const user = res.locals.user;
  if (!content) {
    return res.status(400).json({ msg: "content is required" });
  }

  const post = await prisma.post.create({
    data: {
      content,
      userId: Number(user.id),
    },
    include: {
      user: true,
      likes: true,
      comments: true,
    },
  });

  res.status(201).json(post);
});

router.delete("/posts/:id", auth, isOwner("posts"), async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: { id: Number(id) },
    include: {
      comments: true,
      likes: true,
    },
  });

  res.json(post);
});

router.post("/posts/:id/like", auth, async (req, res) => {
  const { id } = req.params;
  const user = res.locals.user;

  try {
    const like = await prisma.like.create({
      data: {
        userId: user.id,
        postId: Number(id),
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        likes: true,
      },
    });

    clients.map((client) => {
      if (client.userId == post.user.id) {
        // Be careful here: could also be post.userId
        client.ws.send(JSON.stringify({ event: "notis" }));
        console.log(`WS: event sent to ${client.userId}: notis`);
      }
    });

    if (post.user.id !== user.id) {
      await prisma.notification.create({
        data: {
          type: "like",
          postId: Number(id),
          userId: post.user.id,
          actorId: user.id,
        },
      });
    }

    res.json(post);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ msg: "Already liked" });
    }
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/posts/:id/like", auth, async (req, res) => {
  const { id } = req.params;
  const user = res.locals.user;

  try {
    const dislike = await prisma.like.deleteMany({
      where: {
        postId: Number(id),
        userId: user.id,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        likes: true,
      },
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/notis", auth, async (req, res) => {
  const user = res.locals.user;
  const notis = await prisma.notification.findMany({
    where: {
      userId: Number(user.id),
    },
    include: {
      user: true,
      actor: true,
    },
    orderBy: { id: "desc" },
    take: 20,
  });

  res.json(notis);
});

router.put("/notis/read", auth, async (req, res) => {
  const user = res.locals.user;

  await prisma.notification.updateMany({
    where: {
      post: {
        userId: Number(user.id),
      },
    },
    data: { read: true },
  });

  res.json({ msg: "Marked all notis as read" });
});

router.put("/notis/read/:id", auth, async (req, res) => {
  const { id } = req.params;
  const user = res.locals.user;

  const noti = await prisma.notification.update({
    where: {
      id: Number(id),
      // post: {
      //   userId: Number(user.id),
      // }, this was unnecessary, and also giving errors when updating noti related to user follows
    },
    data: { read: true },
  });

  res.json(noti);
});

module.exports = { postsRouter: router };
