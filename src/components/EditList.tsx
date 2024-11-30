import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const EditList: React.FC = () => {
  const { listId } = useParams<{ listId: string }>(); // Get the listId from the URL
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Error message
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const checkAccessAndFetchTodos = async () => {
      if (!listId) return;

      setLoading(true);
      try {
        const listRef = doc(db, "lists", listId);
        const listSnapshot = await getDoc(listRef);

        if (!listSnapshot.exists()) {
          setError("List Not Found");
          setLoading(false);
          return;
        }

        const listData = listSnapshot.data();
        const userEmail = auth.currentUser?.uid;

        if (!listData?.collaborators?.includes(userEmail)) {
          setError("Unauthorized Access");
          setLoading(false);
          return;
        }

        // If authorized, set up the Firestore listener
        const todosRef = collection(db, "todos");
        const q = query(todosRef, where("listId", "==", listId));
        unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedTodos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Todo[];
          setTodos(fetchedTodos);
          setError(null);
        });
      } catch (error) {
        console.error("Error checking access or fetching todos:", error);
        setError("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndFetchTodos();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [listId]);

  const addTask = async () => {
    const userEmail = auth.currentUser?.uid;

    if (!userEmail || !newTask.trim()) {
      alert("Task description is required.");
      return;
    }

    const newTodo = {
      listId,
      text: newTask.trim(),
      completed: false,
      createdBy: userEmail,
      createdAt: new Date(),
    };
    try {
      await addDoc(collection(db, "todos"), newTodo);
      setNewTask(""); // Clear input after adding
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add the task. Try again later.");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, { completed: !completed });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">{error}</h1>
        {error === "List Not Found" && (
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Edit List</h1>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Add a New Task</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Task Description"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Add Task
          </button>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Tasks</h2>
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-4 border rounded-md bg-white"
          >
            <span
              onClick={() => toggleTaskCompletion(todo.id, todo.completed)}
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTask(todo.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditList;
