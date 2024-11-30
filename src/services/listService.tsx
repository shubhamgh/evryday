import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";

export const testCreateList = async () => {
  const userId = auth.currentUser?.uid; // Ensure the user is authenticated
  if (!userId) {
    console.error("User is not authenticated.");
    return;
  }

  const newList = {
    name: "Test List", // Replace with your test list name
    createdBy: userId,
    collaborators: [userId], // Add the creator as a collaborator
    createdAt: new Date(),
  };

  try {
    const docRef = await addDoc(collection(db, "lists"), newList);
    console.log("List created with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating list:", error);
  }
};

export const fetchLists = (
  setLists: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error("User is not authenticated.");
    return; // Explicitly return undefined
  }

  const listsRef = collection(db, "lists");
  const q = query(listsRef, where("collaborators", "array-contains", userId));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedLists = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLists(fetchedLists);
  });

  return unsubscribe;
};

export const createList = async (name: string, collaborators: string[]) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not authenticated.");

  const newList = {
    name: name.trim(),
    createdBy: userId,
    collaborators: [userId, ...collaborators], // Add the creator's UID as a collaborator
    createdAt: new Date(),
  };
  console.log(newList);

  await addDoc(collection(db, "lists"), newList);
};
