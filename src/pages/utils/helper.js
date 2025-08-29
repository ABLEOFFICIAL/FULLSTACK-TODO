// utils/helper.js

// Get the base URL for API requests, supporting both server and client environments
function getBaseUrl() {
  if (typeof window === "undefined") {
    // Server-side: Use environment variable or fallback to localhost
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  }
  // Client-side: Use relative URL
  return "";
}

// Fetch all todos
export async function fetchTodos() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/todos`, { cache: "no-store" });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to fetch todos (status: ${res.status})`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

// Fetch a single todo by ID
export async function fetchTodoById(id) {
  // Validate input
  if (!id || typeof id !== "string") {
    throw new Error("Invalid todo ID");
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/todos/${id}`, {
      cache: "no-store",
    });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to fetch todo (status: ${res.status})`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    throw error;
  }
}

// Add a new todo
export async function addTodo(newTodo) {
  // Validate input
  if (
    !newTodo ||
    typeof newTodo.title !== "string" ||
    typeof newTodo.body !== "string" ||
    !newTodo.title.trim() ||
    !newTodo.body.trim()
  ) {
    throw new Error("Title and body must be non-empty strings");
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTodo.title.trim().slice(0, 100), // Max 100 chars
        body: newTodo.body.trim().slice(0, 500), // Max 500 chars
      }),
    });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to add todo (status: ${res.status})`);
    }
    return data;
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
}

// Update an existing todo
export async function updateTodo(id, updates) {
  // Validate inputs
  if (!id || typeof id !== "string") {
    throw new Error("Invalid todo ID");
  }
  if (
    updates &&
    ((updates.title !== undefined &&
      (typeof updates.title !== "string" || !updates.title.trim())) ||
      (updates.body !== undefined &&
        (typeof updates.body !== "string" || !updates.body.trim())) ||
      (updates.completed !== undefined &&
        typeof updates.completed !== "boolean"))
  ) {
    throw new Error(
      "Invalid updates: title and body must be non-empty strings, completed must be a boolean"
    );
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(updates.title && { title: updates.title.trim().slice(0, 100) }), // Max 100 chars
        ...(updates.body && { body: updates.body.trim().slice(0, 500) }), // Max 500 chars
        ...(updates.completed !== undefined && {
          completed: updates.completed,
        }),
      }),
    });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to update todo (status: ${res.status})`);
    }
    return data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}

// Delete a todo
export async function deleteTodo(id) {
  // Validate input
  if (!id || typeof id !== "string") {
    throw new Error("Invalid todo ID");
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/todos/${id}`, {
      method: "DELETE",
    });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to delete todo (status: ${res.status})`);
    }
    return data;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}
