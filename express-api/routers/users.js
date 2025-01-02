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

router.post("/users", async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: "Required fields cannot be empty." });
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
    res.status(201).json(user);
  } catch {
    res.status(401).json({ msg: "Invalid user response." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Required fields cannot be empty." });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      return res.status(404).json({ msg: "Invalid user." });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      res.json({ token, user });
    }
  } catch {
    res.status(401).json({ msg: "Invalid user." });
  }
});

router.get("/verify", auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: res.locals.user.id,
    },
  });
  res.json(user);
});

module.exports = { usersRouter: router };
