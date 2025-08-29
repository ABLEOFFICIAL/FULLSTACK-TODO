import Link from "next/link";
import { fetchTodoById } from "../../utils/helper";

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const todo = await fetchTodoById(id);
    if (!todo) {
      return { notFound: true };
    }
    return { props: { todo } };
  } catch (error) {
    console.error("Error fetching todo in getServerSideProps:", error);
    return { notFound: true };
  }
}

export default function TodoDetails({ todo }) {
  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-3xl">
        Todo Details
      </h1>
      <div className="border rounded-md shadow-sm p-4 sm:p-6 bg-white">
        <dl className="space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-700">ID</dt>
            <dd className="text-gray-900">{todo.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">Title</dt>
            <dd className="text-gray-900">{todo.title}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">Body</dt>
            <dd className="text-gray-900">{todo.body}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">Status</dt>
            <dd className="text-gray-900">
              <span aria-label={todo.completed ? "Completed" : "Not completed"}>
                {todo.completed ? "✅ Completed" : "❌ Not completed"}
              </span>
            </dd>
          </div>
        </dl>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
