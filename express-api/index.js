const express = require("express");
const app = express();
require("express-ws")(app);
const { wsRouter } = require("./routers/ws");
app.use(wsRouter);

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cors = require("cors");
app.use(cors());

const { usersRouter } = require("./routers/users");
const { postsRouter } = require("./routers/posts");
const { commentsRouter } = require("./routers/comments");
app.use(postsRouter);
app.use(usersRouter);
app.use(commentsRouter);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(8080, () => {
  console.log("Express API started at port 8080...");
});
