import { useState } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../utils/helper";
import Link from "next/link";

export default function Home({ todos, error }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [clientError, setClientError] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setClientError("Title and body are required");
      return;
    }
    try {
      setClientError(null);
      await addTodo({ title, body });
      setTitle("");
      setBody("");
      window.location.reload(); // Refresh to fetch updated todos
    } catch (error) {
      console.error("Error adding todo:", error.message);
      setClientError("Failed to add todo: " + error.message);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      setClientError(null);
      await updateTodo(id, { completed: !completed });
      window.location.reload();
    } catch (error) {
      console.error("Error updating todo:", error.message);
      setClientError("Failed to update todo: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setClientError(null);
      await deleteTodo(id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting todo:", error.message);
      setClientError("Failed to delete todo: " + error.message);
    }
  };

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-md mx-auto p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {clientError && <p className="text-red-500 mb-4">{clientError}</p>}
        <form onSubmit={handleAdd} className="mb-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Todo
          </button>
        </form>
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center">No todos yet.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="p-3 border border-neutral-400 rounded flex justify-between items-center"
              >
                <div>
                  <Link
                    href={`/todos/${todo.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    <h2 className={todo.completed ? "line-through" : ""}>
                      {todo.title}
                    </h2>
                  </Link>
                  <p
                    className={
                      todo.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    {todo.body}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleToggleComplete(todo.id, todo.completed)
                    }
                    className={`p-1 rounded ${
                      todo.completed ? "bg-yellow-500" : "bg-green-500"
                    } text-white`}
                  >
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="p-1 bg-red-500 text-white rounded"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  console.log("Running getServerSideProps for Home...");
  try {
    const todos = await fetchTodos();
    console.log("Initial todos fetched:", todos);
    return {
      props: {
        todos,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error.message, error.stack);
    return {
      props: {
        todos: [],
        error: "Failed to load todos: " + error.message,
      },
    };
  }
}
