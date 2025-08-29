const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchTodos() {
  try {
    console.log("Fetching todos from:", `${BASE_URL}/api/todos`);
    const res = await fetch(`${BASE_URL}/api/todos`, { cache: "no-store" });
    console.log("Fetch todos response status:", res.status, "OK:", res.ok);
    if (!res.ok) {
      const text = await res.text();
      console.log("Fetch todos response text:", text.slice(0, 100));
      throw new Error(
        `Failed to fetch todos (status: ${res.status}, response: ${text.slice(
          0,
          100
        )})`
      );
    }
    const { data, error } = await res.json();
    if (error) {
      throw new Error(error);
    }
    console.log("Fetched todos:", data);
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
    console.log("Fetch todo by ID response status:", res.status, "OK:", res.ok);
    if (!res.ok) {
      const text = await res.text();
      console.log("Fetch todo by ID response text:", text.slice(0, 100));
      throw new Error(
        `Failed to fetch todo (status: ${res.status}, response: ${text.slice(
          0,
          100
        )})`
      );
    }
    const { data, error } = await res.json();
    if (error) {
      throw new Error(error);
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
    console.log("Add todo response status:", res.status, "OK:", res.ok);
    if (!res.ok) {
      const text = await res.text();
      console.log("Add todo response text:", text.slice(0, 100));
      throw new Error(
        `Failed to add todo (status: ${res.status}, response: ${text.slice(
          0,
          100
        )})`
      );
    }
    const { data, error } = await res.json();
    if (error) {
      throw new Error(error);
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
    console.log("Update todo response status:", res.status, "OK:", res.ok);
    if (!res.ok) {
      const text = await res.text();
      console.log("Update todo response text:", text.slice(0, 100));
      throw new Error(
        `Failed to update todo (status: ${res.status}, response: ${text.slice(
          0,
          100
        )})`
      );
    }
    const { data, error } = await res.json();
    if (error) {
      throw new Error(error);
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
    console.log("Delete todo response status:", res.status, "OK:", res.ok);
    if (!res.ok) {
      const text = await res.text();
      console.log("Delete todo response text:", text.slice(0, 100));
      throw new Error(
        `Failed to delete todo (status: ${res.status}, response: ${text.slice(
          0,
          100
        )})`
      );
    }
    const { data, error } = await res.json();
    if (error) {
      throw new Error(error);
    }
    console.log("Deleted todo:", data);
    return data;
  } catch (error) {
    console.error("Error deleting todo:", error.message, error.stack);
    throw error;
  }
}
