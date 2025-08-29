import { useState } from "react";
import Link from "next/link";
import { fetchTodos, addTodo, deleteTodo, updateTodo } from "../utils/helper";

export default function Home({ initialTodos, error }) {
  const [todos, setTodos] = useState(initialTodos || []);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    setFormError(null);

    try {
      const newTodo = await addTodo({ title, body });
      setTodos((prev) => [...prev, newTodo]);
      setTitle("");
      setBody("");
    } catch (error) {
      setFormError(error.message || "Failed to add todo");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      alert("Failed to delete todo. Please try again.");
    }
  }

  async function toggleComplete(todo) {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (error) {
      alert("Failed to update todo. Please try again.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-3xl">
        Todo List ✅
      </h1>

      {/* Error Message from SSR */}
      {error && (
        <p className="text-red-500 text-center mb-4">
          Failed to load todos: {error}
        </p>
      )}

      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex flex-col gap-3 mb-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-700"
          >
            Body
          </label>
          <input
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter body"
            className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>
        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Add Todo
        </button>
      </form>

      {/* Todo List */}
      {todos.length === 0 ? (
        <p className="text-gray-500 text-center">
          No todos yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-3 rounded-md shadow-sm"
            >
              <div className="flex flex-col">
                <Link href={`/todos/${todo.id}`} passHref>
                  <span
                    className={`cursor-pointer hover:underline ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-blue-600"
                    }`}
                    aria-label={`View todo: ${todo.title}`}
                  >
                    {todo.title}
                  </span>
                </Link>
                <p className="text-sm text-gray-600 mt-1">{todo.body}</p>
              </div>
              <div className="flex gap-2 items-center mt-2 sm:mt-0">
                <button
                  onClick={() => toggleComplete(todo)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    todo.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  } hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  aria-label={
                    todo.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                >
                  {todo.completed ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-500 hover:text-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label={`Delete todo: ${todo.title}`}
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// SSR fetch
export async function getServerSideProps() {
  try {
    const initialTodos = await fetchTodos();
    return { props: { initialTodos } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { props: { initialTodos: [], error: "Failed to load todos" } };
  }
}
