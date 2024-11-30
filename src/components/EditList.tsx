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
  const [listName, setListName] = useState<string>(""); // State for the list name
  const [error, setError] = useState<string | null>(null); // Error message
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const navigate = useNavigate(); // For navigation

  // Function to validate list access and fetch name
  const validateListId = async (
    listId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const listRef = doc(db, "lists", listId);
      const listSnapshot = await getDoc(listRef);

      if (!listSnapshot.exists()) {
        console.error(`List with ID ${listId} does not exist.`);
        return false;
      }

      const listData = listSnapshot.data();
      if (!listData?.collaborators.includes(userId)) {
        console.error(`User ${userId} is not a collaborator for this list.`);
        return false;
      }

      setListName(listData.name || "Untitled List"); // Set the list name
      return true; // All validations passed
    } catch (error) {
      console.error("Error validating listId:", error);
      return false;
    }
  };

  // Function to fetch todos
  const fetchTodos = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !listId) {
      setError("Unauthorized Access");
      setLoading(false);
      return;
    }

    const isValid = await validateListId(listId, userId);
    if (!isValid) {
      setError("Unauthorized Access");
      setLoading(false);
      return;
    }

    const todosRef = collection(db, "todos");
    const q = query(todosRef, where("listId", "==", listId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTodos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];
      setTodos(fetchedTodos);
      setError(null);
      setLoading(false);
    });

    return unsubscribe;
  };

  // Function to add a new task
  const addTask = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId || !newTask.trim()) {
      alert("Task description is required.");
      return;
    }

    const isValid = await validateListId(listId!, userId);
    if (!isValid) {
      alert("You do not have permission to add tasks to this list.");
      return;
    }

    const newTodo = {
      listId,
      text: newTask.trim(),
      completed: false,
      createdBy: userId,
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

  // Function to delete a task
  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Function to toggle task completion
  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, { completed: !completed });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  // UseEffect to fetch todos when component mounts
  useEffect(() => {
    setLoading(true);
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      unsubscribe = await fetchTodos();
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [listId]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <span className="animate-pulse text-lg font-semibold text-gray-600">
          Loading your list items...
        </span>
      </div>
    );
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
      <h1 className="text-3xl font-bold mb-6">{listName}</h1>{" "}
      {/* Display List Name */}
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
