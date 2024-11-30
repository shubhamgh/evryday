import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";

export const fetchTodos = (
  listId: string,
  setTodos: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const todosRef = collection(db, "todos");
  const q = query(todosRef, where("listId", "==", listId));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedTodos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTodos(fetchedTodos);
  });

  return unsubscribe; // Cleanup listener
};

export const addTodo = async (listId: string, text: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId || !text.trim()) return;

  await addDoc(collection(db, "todos"), {
    listId,
    text: text.trim(),
    completed: false,
    createdBy: userId,
    createdAt: new Date(),
  });
};
