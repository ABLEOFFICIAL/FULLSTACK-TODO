import { useState } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../utils/helper";
import { FaPlus } from "react-icons/fa6";
import { ImBin } from "react-icons/im";
import { GrStatusGood } from "react-icons/gr";

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
    <div className="min-h-screen flex justify-center items-center bg-[#f5f5f5] text-black p-4">
      <div className="max-w-lg bg-white mx-auto p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {clientError && <p className="text-red-500 mb-4">{clientError}</p>}
        <form onSubmit={handleAdd} className="mb-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded-xl focus:outline-none"
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 mb-2 border rounded-xl focus:outline-none"
          />
          <button
            type="submit"
            className="w-full font-semibold p-2 bg-[#fece1f] text-black flex justify-center items-center gap-1 rounded-xl"
          >
            <FaPlus />
            Add Todo
          </button>
        </form>
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center">No todos yet.</p>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <Link
                href={`/todos/${todo.id}`}
                key={todo.id}
                className="p-3 bg-[#f5f5f5] shadow-md rounded-xl flex justify-between items-center"
              >
                <div>
                  <h2
                    className={
                      todo.completed
                        ? "line-through"
                        : "font-semibold text-base"
                    }
                  >
                    {todo.title}
                  </h2>
                  <p
                    className={
                      todo.completed
                        ? "line-through text-gray-500"
                        : "font-medium text-neutral-600"
                    }
                  >
                    {todo.body}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleComplete(todo.id, todo.completed);
                    }}
                    className={`p-1 rounded-xl cursor-pointer `}
                  >
                    {todo.completed ? (
                      <span className="border-2 rounded-full w-4 h-4 block"></span>
                    ) : (
                      <GrStatusGood size={20} />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(todo.id);
                    }}
                    className="p-1 rounded-xl cursor-pointer"
                  >
                    <ImBin />
                  </button>
                </div>
              </Link>
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
