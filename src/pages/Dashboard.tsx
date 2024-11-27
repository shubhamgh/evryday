// /src/pages/Dashboard.tsx
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { todoListState, Todo } from "../store/atoms/todoAtom";
import { filterState } from "../store/atoms/filterAtom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { filteredTodosSelector } from "../store/selectors/todoSelectors";

const Dashboard: React.FC = () => {
  const [todos, setTodos] = useRecoilState(todoListState);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useRecoilState(filterState); // Manage filter state
  const filteredTodos = useRecoilValue(filteredTodosSelector); // Get filtered todos

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newItem: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
    };
    setTodos([...todos, newItem]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={async () => {
              await signOut(auth);
              localStorage.removeItem("username");
              window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Todo List</h2>
          {/* Add Todo */}
          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            >
              Add
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-4 mb-6">
            {["All", "Completed", "Pending"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setFilter(type as "All" | "Completed" | "Pending")
                }
                className={`px-3 py-1 rounded-md transition ${
                  filter === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Todo Items */}
          <ul className="space-y-4">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition"
              >
                <span
                  onClick={() => toggleTodo(todo.id)}
                  className={`cursor-pointer ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg
                  bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {/* Empty State */}
          {filteredTodos.length === 0 && (
            <p className="text-gray-500 text-center mt-4">No tasks found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
