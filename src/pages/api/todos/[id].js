import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      data: null,
      message: null,
      error: "Invalid todo ID",
    });
  }

  if (req.method === "GET") {
    try {
      console.log(`Fetching todo with ID: ${id}`);
      const docRef = doc(db, "todos", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return res.status(404).json({
          data: null,
          message: null,
          error: "Todo not found",
        });
      }
      console.log("Todo fetched:", { id, ...docSnap.data() });
      return res.status(200).json({
        data: { id, ...docSnap.data() },
        message: "Todo fetched successfully",
        error: null,
      });
    } catch (error) {
      console.error("Error fetching todo:", error.message, error.stack);
      return res.status(500).json({
        data: null,
        message: null,
        error: "Failed to fetch todo: " + error.message,
      });
    }
  }

  if (req.method === "PUT") {
    const { title, body, completed } = req.body;
    if (
      (title !== undefined && (typeof title !== "string" || !title.trim())) ||
      (body !== undefined && (typeof body !== "string" || !body.trim())) ||
      (completed !== undefined && typeof completed !== "boolean")
    ) {
      return res.status(400).json({
        data: null,
        message: null,
        error:
          "Invalid updates: title/body must be non-empty strings, completed must be a boolean",
      });
    }

    try {
      console.log(`Updating todo with ID: ${id}`);
      const docRef = doc(db, "todos", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return res.status(404).json({
          data: null,
          message: null,
          error: "Todo not found",
        });
      }
      const updates = {
        ...(title && { title: title.trim().slice(0, 100) }),
        ...(body && { body: body.trim().slice(0, 500) }),
        ...(completed !== undefined && { completed }),
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(docRef, updates);
      console.log("Todo updated:", { id, ...updates });
      return res.status(200).json({
        data: { id, ...docSnap.data(), ...updates },
        message: "Todo updated successfully",
        error: null,
      });
    } catch (error) {
      console.error("Error updating todo:", error.message, error.stack);
      return res.status(500).json({
        data: null,
        message: null,
        error: "Failed to update todo: " + error.message,
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      console.log(`Deleting todo with ID: ${id}`);
      const docRef = doc(db, "todos", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return res.status(404).json({
          data: null,
          message: null,
          error: "Todo not found",
        });
      }
      await deleteDoc(docRef);
      console.log("Todo deleted:", id);
      return res.status(200).json({
        data: { id },
        message: "Todo deleted successfully",
        error: null,
      });
    } catch (error) {
      console.error("Error deleting todo:", error.message, error.stack);
      return res.status(500).json({
        data: null,
        message: null,
        error: "Failed to delete todo: " + error.message,
      });
    }
  }

  return res.status(405).json({
    data: null,
    message: null,
    error: "Method not allowed",
  });
}
