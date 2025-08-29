const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchTodos() {
  try {
    console.log("Fetching todos from:", `${BASE_URL}/api/todos`);
    const res = await fetch(`${BASE_URL}/api/todos`, { cache: "no-store" });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to fetch todos (status: ${res.status})`);
    }
    console.log("Fetched todos from API:", data);
    return data;
  } catch (error) {
    console.error("Error fetching todos:", error.message, error.stack);
    throw new Error("Failed to fetch todos: " + error.message);
  }
}

export async function fetchTodoById(id) {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid todo ID");
  }

  try {
    console.log("Fetching todo by ID from:", `${BASE_URL}/api/todos/${id}`);
    const res = await fetch(`${BASE_URL}/api/todos/${id}`, {
      cache: "no-store",
    });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to fetch todo (status: ${res.status})`);
    }
    console.log("Fetched todo by ID:", data);
    return data;
  } catch (error) {
    console.error("Error fetching todo by ID:", error.message, error.stack);
    throw error;
  }
}

export async function addTodo(newTodo) {
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
    console.log("Adding todo to:", `${BASE_URL}/api/todos`);
    const res = await fetch(`${BASE_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTodo.title.trim().slice(0, 100),
        body: newTodo.body.trim().slice(0, 500),
      }),
    });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to add todo (status: ${res.status})`);
    }
    console.log("Added todo:", data);
    return data;
  } catch (error) {
    console.error("Error adding todo:", error.message, error.stack);
    throw error;
  }
}

export async function updateTodo(id, updates) {
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
    console.log("Updating todo at:", `${BASE_URL}/api/todos/${id}`);
    const res = await fetch(`${BASE_URL}/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(updates.title && { title: updates.title.trim().slice(0, 100) }),
        ...(updates.body && { body: updates.body.trim().slice(0, 500) }),
        ...(updates.completed !== undefined && {
          completed: updates.completed,
        }),
      }),
    });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to update todo (status: ${res.status})`);
    }
    console.log("Updated todo:", data);
    return data;
  } catch (error) {
    console.error("Error updating todo:", error.message, error.stack);
    throw error;
  }
}

export async function deleteTodo(id) {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid todo ID");
  }

  try {
    console.log("Deleting todo at:", `${BASE_URL}/api/todos/${id}`);
    const res = await fetch(`${BASE_URL}/api/todos/${id}`, {
      method: "DELETE",
    });
    const { data, error } = await res.json();
    if (!res.ok) {
      throw new Error(error || `Failed to delete todo (status: ${res.status})`);
    }
    console.log("Deleted todo:", data);
    return data;
  } catch (error) {
    console.error("Error deleting todo:", error.message, error.stack);
    throw error;
  }
}
