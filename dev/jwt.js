const jwt = require("jsonwebtoken");

const user = { id: 1, name: "Alice", username: "alice" };
const secret = "some secret";

const token = jwt.sign(user, secret);
// console.log(token);

const output =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFsaWNlIiwidXNlcm5hbWUiOiJhbGljZSIsImlhdCI6MTczNTM3NjA5MH0.yJgl17P_01X7d75LFZ3hdmv4lsFD007rE11RQoCMRlk";
console.log(jwt.verify(output, secret));
