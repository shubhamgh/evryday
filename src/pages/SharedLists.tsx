import React, { useState, useEffect } from "react";
import { fetchLists } from "../services/listService";

const SharedLists: React.FC = () => {
  const [lists, setLists] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = fetchLists(setLists); // Call fetchLists

    // Return cleanup function if unsubscribe is defined
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Shared Lists</h1>
      <ul>
        {lists.map((list) => (
          <li key={list.id} className="mb-4">
            <button
              onClick={() => console.log(`Open list ${list.id}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {list.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SharedLists;
