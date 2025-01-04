const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

const { usersRouter } = require("./routers/users");
const { postsRouter } = require("./routers/posts");
const { commentsRouter } = require("./routers/comments");

app.use(usersRouter);
app.use(postsRouter);
app.use(commentsRouter);

app.listen(8080, () => {
    console.log("Express API running at 8080");
});
