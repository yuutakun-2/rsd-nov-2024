const express = require("express");
const app = express();

app.get("/posts", (req, res) => {
  res.json({ data: "posts" });
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  res.json({ data: `posts: ${id}` });
});

app.listen(8080, (req, res) => {
  console.log("Express API started at port 8080.");
});
