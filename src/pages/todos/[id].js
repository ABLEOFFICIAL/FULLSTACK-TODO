import { useState } from "react";
import { useRouter } from "next/router";
import { fetchTodoById, updateTodo } from "../../utils/helper";
import Link from "next/link";

export default function TodoDetail({ todo, error }) {
  const router = useRouter();
  const [title, setTitle] = useState(todo?.title || "");
  const [body, setBody] = useState(todo?.body || "");
  const [clientError, setClientError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setClientError("Title and body are required");
      return;
    }
    try {
      setClientError(null);
      await updateTodo(todo.id, { title, body });
      router.push("/");
    } catch (error) {
      console.error("Error updating todo:", error.message);
      setClientError("Failed to update todo: " + error.message);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Error</h1>
          <p className="text-red-500">{error}</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Todo Not Found
          </h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-md mx-auto  p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Todo</h1>
        {clientError && <p className="text-red-500 mb-4">{clientError}</p>}
        <form onSubmit={handleUpdate} className="mb-6">
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
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <Link
              href="/"
              className="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
        <p className={todo.completed ? "line-through text-gray-500" : ""}>
          Status: {todo.completed ? "Completed" : "Incomplete"}
        </p>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  console.log("Running getServerSideProps for TodoDetail, ID:", params.id);
  try {
    const todo = await fetchTodoById(params.id);
    console.log("Todo fetched for detail:", todo);
    return {
      props: {
        todo,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error.message, error.stack);
    return {
      props: {
        todo: null,
        error: "Failed to load todo: " + error.message,
      },
    };
  }
}
