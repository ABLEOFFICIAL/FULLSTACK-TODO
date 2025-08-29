import { db } from "../../../lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      console.log("Fetching todos from Firestore...");
      const querySnapshot = await getDocs(collection(db, "todos"));
      const todos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Todos fetched:", todos);
      return res.status(200).json({
        data: todos,
        message: "Todos fetched successfully",
        error: null,
      });
    } catch (error) {
      console.error("Error fetching todos:", error.message, error.stack);
      return res.status(500).json({
        data: null,
        message: null,
        error: "Failed to load todos: " + error.message,
      });
    }
  }

  if (req.method === "POST") {
    const { title, body } = req.body;
    if (
      !title ||
      !body ||
      typeof title !== "string" ||
      typeof body !== "string"
    ) {
      console.log("Invalid POST payload:", req.body);
      return res.status(400).json({
        data: null,
        message: null,
        error: "Title and body are required and must be strings",
      });
    }

    try {
      console.log("Creating todo:", { title, body });
      const newTodo = {
        title: title.trim().slice(0, 100),
        body: body.trim().slice(0, 500),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "todos"), newTodo);
      console.log("Todo created with ID:", docRef.id);
      return res.status(201).json({
        data: { id: docRef.id, ...newTodo },
        message: "Todo created successfully",
        error: null,
      });
    } catch (error) {
      console.error("Error creating todo:", error.message, error.stack);
      return res.status(500).json({
        data: null,
        message: null,
        error: "Failed to create todo: " + error.message,
      });
    }
  }

  return res
    .status(405)
    .json({ data: null, message: null, error: "Method not allowed" });
}
