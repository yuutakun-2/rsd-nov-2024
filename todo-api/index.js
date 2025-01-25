const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const bodyParser = require("body-parser");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Parse application/json
app.use(bodyParser.json());

// Get all todos
app.get("/todos", async (req, res) => {
	const todos = await prisma.todo.findMany({
		orderBy: { createdAt: "desc" },
	});
	res.json(todos);
});

// Create todo
app.post("/todos", async (req, res) => {
	const { title } = req.body;
	const todo = await prisma.todo.create({
		data: { title },
	});
	res.json(todo);
});

// Toggle todo status
app.put("/todos/:id", async (req, res) => {
	const { id } = req.params;
	const todo = await prisma.todo.findUnique({ where: { id: Number(id) } });
	const updated = await prisma.todo.update({
		where: { id: Number(id) },
		data: { completed: !todo.completed },
	});
	res.json(updated);
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
	const { id } = req.params;
	const todo = await prisma.todo.delete({
		where: { id: Number(id) },
	});
	res.json(todo);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
