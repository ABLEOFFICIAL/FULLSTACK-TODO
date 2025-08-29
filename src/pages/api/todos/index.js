import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "todos.json");

async function readTodos() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return []; // File doesn't exist, return empty array
    }
    throw error;
  }
}

async function writeTodos(todos) {
  try {
    await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error("Write error:", error.code, error.message);
    throw new Error("Failed to write to todos.json: " + error.message);
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const todos = await readTodos();
      return res
        .status(200)
        .json({ data: todos, message: "Todos fetched successfully" });
    } catch (error) {
      console.error("Error fetching todos:", error);
      return res
        .status(500)
        .json({ data: null, message: null, error: "Failed to load todos" });
    }
  }

  if (req.method === "POST") {
    const { title, body } = req.body;
    if (
      !title ||
      !body ||
      typeof title !== "string" ||
      typeof body !== "string"
    ) {
      return res.status(400).json({
        data: null,
        message: null,
        error: "Title and body are required",
      });
    }

    try {
      const todos = await readTodos();
      const newTodo = {
        id: uuidv4(),
        title: title.trim().slice(0, 100),
        body: body.trim().slice(0, 500),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      todos.push(newTodo);
      await writeTodos(todos);
      return res
        .status(201)
        .json({ data: newTodo, message: "Todo created successfully" });
    } catch (error) {
      console.error("Error creating todo:", error);
      return res.status(500).json({
        data: null,
        message: null,
        error: "Failed to create todo: " + error.message,
      });
    }
  }

  return res
    .status(405)
    .json({ data: null, message: null, error: "Method not allowed" });
}
