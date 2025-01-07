const express = require("express");
const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cors = require("cors");
app.use(cors());

const { usersRouter } = require("./routers/users");
app.use(usersRouter);

const { auth, isOwner } = require("./middlewares/auth");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/posts", async (req, res) => {
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

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params; // {id} is to accept other parameters from the user's input
  const post = await prisma.post.findFirst({
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

app.post("/posts", auth, async (req, res) => {
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
    },
  });

  res.status(201).json(post);
});

app.delete("/posts/:id", auth, isOwner("posts"), async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: { id: Number(id) },
  });

  res.json(post);
});

app.post("/posts/:id/like", auth, async (req, res) => {
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

    res.json(post);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ msg: "Already liked" });
    }
    res.status(500).json({ msg: err.message });
  }
});

app.delete("/posts/:id/like", auth, async (req, res) => {
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

app.listen(8080, () => {
  console.log("Express API started at port 8080...");
});
