const express = require("express");
const router = express.Router();
// require("express-ws")(app); // Why is this not used here?
const jwt = require("jsonwebtoken");

let clients = [];

router.ws("/subscribe", (ws, req) => {
  console.log("WS: New connection received.");

  ws.on("message", (msg) => {
    const secret = process.env.JWT_SECRET;
    const { token } = JSON.parse(msg);
    console.log("Token received from WS");

    console.log("JWT Secret:", secret);
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return false;
      }

      clients.push({ userId: user.id, ws });

      console.log(`WS: Client added: ${user.id}`);
    });
  });
});

module.exports = { clients, wsRouter: router };
