import fs from "fs/promises";
import path from "path";

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

// API handler for GET, PUT, and DELETE requests
export default async function handler(req, res) {
  const { id } = req.query;

  // Validate ID
  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ data: null, message: null, error: "Invalid todo ID" });
  }

  const todos = await readTodos();
  const todoIndex = todos.findIndex((t) => t.id === id);

  // Check if todo exists
  if (todoIndex === -1) {
    return res
      .status(404)
      .json({ data: null, message: null, error: "Todo not found" });
  }

  // Standard response structure
  const respond = (data, status = 200, message = null, error = null) => {
    res.status(status).json({ data, message, error });
  };

  if (req.method === "GET") {
    try {
      return respond(todos[todoIndex], 200, "Todo fetched successfully");
    } catch (error) {
      return respond(null, 500, null, "Failed to fetch todo");
    }
  }

  if (req.method === "PUT") {
    try {
      const { title, body, completed } = req.body;

      // Validate inputs
      if (
        (title !== undefined && (typeof title !== "string" || !title.trim())) ||
        (body !== undefined && (typeof body !== "string" || !body.trim())) ||
        (completed !== undefined && typeof completed !== "boolean")
      ) {
        return respond(
          null,
          400,
          null,
          "Invalid input: title and body must be non-empty strings, completed must be a boolean"
        );
      }

      // Update only provided fields
      const updatedTodo = {
        ...todos[todoIndex],
        ...(title !== undefined && { title: title.trim().slice(0, 100) }), // Max 100 chars
        ...(body !== undefined && { body: body.trim().slice(0, 500) }), // Max 500 chars
        ...(completed !== undefined && { completed }),
        updatedAt: new Date().toISOString(),
      };

      todos[todoIndex] = updatedTodo;
      await writeTodos(todos);

      return respond(updatedTodo, 200, "Todo updated successfully");
    } catch (error) {
      return respond(null, 500, null, "Failed to update todo");
    }
  }

  if (req.method === "DELETE") {
    try {
      const deletedTodo = todos.splice(todoIndex, 1)[0];
      await writeTodos(todos);
      return respond(deletedTodo, 200, "Todo deleted successfully");
    } catch (error) {
      return respond(null, 500, null, "Failed to delete todo");
    }
  }

  // Handle unsupported methods
  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return respond(null, 405, null, `Method ${req.method} Not Allowed`);
}
