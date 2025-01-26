const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { auth } = require("../middlewares/auth");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { clients } = require("./ws");

router.post("/users", async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: await bcrypt.hash(password, 10),
      },
    });
    // res.status(201).json({ message: "User created successfully." }, user);
    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    res.status(401).json(err.message);
  }
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      posts: {
        orderBy: { id: "desc" },
        include: {
          user: true,
          likes: true,
          comments: true,
          // _count: {
          //   select: {
          //     likes: true,
          //     comments: true,
          //   },
          // },
        },
      },
      follows: {
        include: {
          following: true,
        },
      },
      followers: {
        include: {
          follower: true,
        },
      },
    },
  });

  if (!user) {
    res.status(404).json({ msg: "User not found." });
  }
  // const followCount = {
  //   ...user,
  //   follwersCount: user.followers.length,
  //   followingCount: user.following.length,
  // };

  res.status(200).json(user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password required." });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      return res.status(401).json({ msg: "Invalid username and password." });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user });
    }
  } catch {
    res.status(401).json({ msg: "Invalid user." });
  }
});

router.post("/users/:id/follow", auth, async (req, res) => {
  const { id } = req.params;
  const authUser = res.locals.user.id;

  if (Number(id) === Number(authUser))
    return res.status(400).json({ msg: "You cannot follow yourself." });

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: Number(authUser),
        followingId: Number(id),
      },
      include: {
        following: true,
        follower: true,
      },
    });

    // WS to send noti
    clients.map((client) => {
      if (client.userId == follow.followingId) {
        console.log(
          "client.userId == follow.followingId at users.js client map"
        );
        client.ws.send(JSON.stringify({ event: "notis" }));
        console.log(`WS: event sent to ${client.userId}: follow`);
      }
    });

    // Noti create
    const noti = await prisma.notification.create({
      data: {
        type: "follow",
        userId: Number(id),
        actorId: Number(authUser),
        read: false,
      },
    });

    res.status(201).json(follow);
  } catch (err) {
    return res.json(err.message);
  }
});

router.delete("/users/:id/unfollow", auth, async (req, res) => {
  const { id } = req.params;
  const authUser = res.locals.user.id;

  if (Number(id) === Number(authUser))
    return res.status(400).json({ msg: "You cannot unfollow yourself." });

  try {
    const unfollow = await prisma.follow.deleteMany({
      where: {
        AND: [{ followerId: Number(authUser) }, { followingId: Number(id) }],
      },
    });

    res.json(unfollow);
  } catch (err) {
    return res.json(err.message);
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query; // q refers to /search?q=

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [{ name: { contains: q } }, { username: { contains: q } }],
      },
      take: 10,
    });

    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/verify", auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: res.locals.user.id,
    },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

module.exports = { usersRouter: router };
