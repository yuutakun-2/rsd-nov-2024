const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function auth(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Token is required." });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = user;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token." });
  }
}

function isOwner(type) {
  return async (req, res, next) => {
    if (type === "post") {
      const reqId = req.params.id;
      const post = await prisma.post.findUnique({
        where: {
          id: Number(reqId),
        },
      });

      if (res.locals.user.id !== post.userId) {
        res.status(403).json({ msg: "Forbidden" });
      }
    }
    return next();
  };
}

module.exports = { auth, isOwner };
