import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const { id } = req.query;

  // Validate ID
  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ data: null, message: null, error: "Invalid todo ID" });
  }

  // Standard response structure
  const respond = (data, status = 200, message = null, error = null) => {
    res.status(status).json({ data, message, error });
  };

  if (req.method === "GET") {
    try {
      const todoDoc = await getDoc(doc(db, "todos", id));
      if (!todoDoc.exists()) {
        return respond(null, 404, null, "Todo not found");
      }
      return respond(
        { id: todoDoc.id, ...todoDoc.data() },
        200,
        "Todo fetched successfully"
      );
    } catch (error) {
      console.error("Error fetching todo:", error);
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

      // Check if todo exists
      const todoDoc = await getDoc(doc(db, "todos", id));
      if (!todoDoc.exists()) {
        return respond(null, 404, null, "Todo not found");
      }

      // Update only provided fields
      const updateData = {
        ...(title !== undefined && { title: title.trim().slice(0, 100) }),
        ...(body !== undefined && { body: body.trim().slice(0, 500) }),
        ...(completed !== undefined && { completed }),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "todos", id), updateData);
      return respond(
        { id, ...todoDoc.data(), ...updateData },
        200,
        "Todo updated successfully"
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      return respond(null, 500, null, "Failed to update todo");
    }
  }

  if (req.method === "DELETE") {
    try {
      const todoDoc = await getDoc(doc(db, "todos", id));
      if (!todoDoc.exists()) {
        return respond(null, 404, null, "Todo not found");
      }
      await deleteDoc(doc(db, "todos", id));
      return respond(
        { id, ...todoDoc.data() },
        200,
        "Todo deleted successfully"
      );
    } catch (error) {
      console.error("Error deleting todo:", error);
      return respond(null, 500, null, "Failed to delete todo");
    }
  }

  // Handle unsupported methods
  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return respond(null, 405, null, `Method ${req.method} Not Allowed`);
}
