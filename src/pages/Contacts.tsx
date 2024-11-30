import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { BsSortDownAlt, BsFillPlusCircleFill } from "react-icons/bs";
import AddContactModal from "../components/AddContactModal";
import { Contact } from "../types";

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("nameAsc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Ref for clicking outside the dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const contactsRef = collection(db, "contacts");
    const q = query(
      contactsRef,
      where("createdBy", "==", userId),
      orderBy(
        sortOption.includes("date") ? "dateCreated" : "name",
        sortOption.includes("desc") ? "desc" : "asc"
      )
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedContacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];
      setContacts(fetchedContacts);
    });

    return () => unsubscribe();
  }, [sortOption]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
      </div>

      {/* Search and Sort */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => setSortDropdownOpen((prev) => !prev)}
          >
            <BsSortDownAlt className="text-lg" />
            <span>Sort</span>
          </button>
          {sortDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
              <li
                onClick={() => {
                  setSortOption("nameAsc");
                  setSortDropdownOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  sortOption === "nameAsc" ? "font-bold" : ""
                }`}
              >
                Alphabetical (A-Z)
              </li>
              <li
                onClick={() => {
                  setSortOption("nameDesc");
                  setSortDropdownOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  sortOption === "nameDesc" ? "font-bold" : ""
                }`}
              >
                Alphabetical (Z-A)
              </li>
              <li
                onClick={() => {
                  setSortOption("dateOldest");
                  setSortDropdownOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  sortOption === "dateOldest" ? "font-bold" : ""
                }`}
              >
                Date Added (Oldest)
              </li>
              <li
                onClick={() => {
                  setSortOption("dateNewest");
                  setSortDropdownOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  sortOption === "dateNewest" ? "font-bold" : ""
                }`}
              >
                Date Added (Newest)
              </li>
            </ul>
          )}
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          <BsFillPlusCircleFill className="text-lg mr-2" />
          Add Contact
        </button>
      </div>

      {/* Contact Tiles or No Contacts Message */}
      {contacts.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">
            No contacts available. Start by adding your first contact.
          </p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts
            .filter((contact) =>
              contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((contact) => (
              <motion.div
                key={contact.id}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                onClick={() => setSelectedContact(contact)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h2 className="text-lg font-semibold">{contact.name}</h2>
                <p className="text-gray-600">{contact.email}</p>
              </motion.div>
            ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddContactModal
            onClose={() => setAddModalOpen(false)}
            // onAdd={(newContact) => setContacts([...contacts, newContact])}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contacts;
