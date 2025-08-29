import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // For unique IDs

// Define file path for todos.json in the project root
const filePath = path.join(process.cwd(), "todos.json");

// Ensure todos.json exists, create with empty array if not
async function initializeFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify([], null, 2));
  }
}

// Read todos from file
async function readTodos() {
  try {
    await initializeFile();
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading todos:", error);
    return [];
  }
}

// Write todos to file
async function writeTodos(todos) {
  try {
    await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error("Error writing todos:", error);
    throw new Error("Failed to write to todos file");
  }
}

// API handler for GET and POST requests
export default async function handler(req, res) {
  // Standard response structure
  const respond = (data, status = 200, message = null, error = null) => {
    res.status(status).json({ data, message, error });
  };

  if (req.method === "GET") {
    try {
      const todos = await readTodos();
      return respond(todos, 200, "Todos fetched successfully");
    } catch (error) {
      return respond(null, 500, null, "Failed to fetch todos");
    }
  }

  if (req.method === "POST") {
    try {
      const { title, body } = req.body;

      // Validate inputs
      if (
        !title ||
        !body ||
        typeof title !== "string" ||
        typeof body !== "string"
      ) {
        return respond(
          null,
          400,
          null,
          "Title and body must be non-empty strings"
        );
      }

      // Trim and limit input lengths
      const trimmedTitle = title.trim().slice(0, 100); // Max 100 chars
      const trimmedBody = body.trim().slice(0, 500); // Max 500 chars
      if (!trimmedTitle || !trimmedBody) {
        return respond(
          null,
          400,
          null,
          "Title and body cannot be empty after trimming"
        );
      }

      const todos = await readTodos();
      const newTodo = {
        id: uuidv4(), // Use UUID for unique IDs
        title: trimmedTitle,
        body: trimmedBody,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      todos.push(newTodo);
      await writeTodos(todos);

      return respond(newTodo, 201, "Todo created successfully");
    } catch (error) {
      return respond(null, 500, null, "Failed to create todo");
    }
  }

  // Handle unsupported methods
  res.setHeader("Allow", ["GET", "POST"]);
  return respond(null, 405, null, `Method ${req.method} Not Allowed`);
}
