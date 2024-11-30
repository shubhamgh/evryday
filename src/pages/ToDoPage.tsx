import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface List {
  id: string;
  name: string;
  collaborators: string[];
}

const ToDoPage: React.FC = () => {
  const navigate = useNavigate();
  const [listLoading, setListLoading] = useState<boolean>(true);
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState<string>("");
  const [collaborators, setCollaborators] = useState<string>("");

  useEffect(() => {
    const fetchLists = () => {
      setListLoading(true);
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error("User is not authenticated.");
        setListLoading(false);
        return;
      }

      const listsRef = collection(db, "lists");
      const q = query(
        listsRef,
        where("collaborators", "array-contains", userId)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedLists = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as List[];

          setLists(fetchedLists);
          setListLoading(false);
        },
        (error) => {
          console.error("Error in snapshot listener:", error);
          setListLoading(false); // Stop loading if there's an error
        }
      );

      return unsubscribe;
    };

    const unsubscribe = fetchLists();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const createList = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !newListName.trim()) {
      alert("List name is required, and you must be authenticated.");
      return;
    }

    const collaboratorsArray = collaborators
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "");

    const newList = {
      name: newListName.trim(),
      createdBy: userId,
      collaborators: [userId, ...collaboratorsArray],
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "lists"), newList);
      setNewListName("");
      setCollaborators("");
      navigate(`/edit-list/${docRef.id}`);
    } catch (error) {
      console.error("Error creating list:", error);
      alert("Failed to create the list. Try again later.");
    }
  };

  const deleteList = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this list? This action cannot be undone."
    );

    if (!confirmDelete) {
      return; // Exit if user cancels
    }

    try {
      await deleteDoc(doc(db, "lists", id));
      console.log(`List ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete the list. Please try again.");
    }
  };

  const navigateToEditList = (id: string): void => {
    navigate(`/edit-list/${id}`);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">To-Do Lists</h1>

      {/* Create New List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Create a New List</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="List Name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring"
          />
          <input
            type="text"
            placeholder="Collaborators (comma-separated UIDs)"
            value={collaborators}
            onChange={(e) => setCollaborators(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring"
          />
          <button
            onClick={createList}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Create List
          </button>
        </div>
      </div>

      {/* Loading State */}
      {listLoading && (
        <div className="text-center py-4">
          <span className="animate-pulse text-lg font-semibold text-gray-600">
            Loading your lists...
          </span>
        </div>
      )}

      {/* Display Lists */}
      {!listLoading && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Lists</h2>
          {lists.length === 0 && (
            <p className="text-gray-500">
              No lists found. Create one to get started!
            </p>
          )}
          <ul className="space-y-4">
            {lists.map((list) => (
              <li
                key={list.id}
                className="flex justify-between items-center p-4 border rounded-md bg-white shadow-sm hover:shadow-md transition"
              >
                <span className="font-medium text-gray-700">{list.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateToEditList(list.id)}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center space-x-2"
                  >
                    <FiEdit2 className="text-lg" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteList(list.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center space-x-2"
                  >
                    <FiTrash2 className="text-lg" />
                    <span>Delete</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ToDoPage;
