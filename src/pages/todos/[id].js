import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchTodoById, updateTodo, deleteTodo } from "../../utils/helper";

export default function TodoDetails({ todo, error }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo?.title || "");
  const [editBody, setEditBody] = useState(todo?.body || "");
  const [editError, setEditError] = useState(null);

  async function handleEditSave() {
    setEditError(null);
    try {
      const updated = await updateTodo(todo.id, {
        title: editTitle,
        body: editBody,
      });
      setEditTitle(updated.title);
      setEditBody(updated.body);
      setIsEditing(false);
    } catch (error) {
      setEditError(error.message || "Failed to update todo");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      await deleteTodo(todo.id);
      router.push("/"); // Redirect to home after deletion
    } catch (error) {
      alert("Failed to delete todo. Please try again.");
    }
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-3xl">
          Todo Details
        </h1>
        <p className="text-red-500 text-center mb-4">Error: {error}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Todo List
        </Link>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="max-w-xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-3xl">
          Todo Details
        </h1>
        <p className="text-gray-500 text-center mb-4">Todo not found</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Todo List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-3xl">
        Todo Details
      </h1>
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        Back to Todo List
      </Link>

      {isEditing ? (
        <div className="flex flex-col gap-3 mb-6">
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Edit title"
              className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              aria-label="Edit todo title"
            />
          </div>
          <div>
            <label
              htmlFor="edit-body"
              className="block text-sm font-medium text-gray-700"
            >
              Body
            </label>
            <textarea
              id="edit-body"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              placeholder="Edit body"
              className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              rows="4"
              aria-label="Edit todo body"
            />
          </div>
          {editError && <p className="text-red-500 text-sm">{editError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleEditSave}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Save todo"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              aria-label="Cancel edit"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="border p-4 rounded-md shadow-sm bg-white">
          <h2
            className={`text-xl font-semibold mb-2 ${
              todo.completed ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {todo.title}
          </h2>
          <p className="text-gray-600 mb-2">{todo.body}</p>
          <p className="text-sm text-gray-500">
            Status: {todo.completed ? "Completed" : "Incomplete"}
          </p>
          <p className="text-sm text-gray-500">
            Created: {new Date(todo.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Updated: {new Date(todo.updatedAt).toLocaleString()}
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              aria-label={`Edit todo: ${todo.title}`}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label={`Delete todo: ${todo.title}`}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const todo = await fetchTodoById(id);
    return { props: { todo } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: { todo: null, error: error.message || "Failed to load todo" },
    };
  }
}
