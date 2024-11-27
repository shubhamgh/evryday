// /src/pages/Contacts.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const initialContacts: Contact[] = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "555-123-4567",
  },
];

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter contacts based on the search term
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort contacts alphabetically
  const sortedContacts = [...filteredContacts].sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const addContact = (newContact: Contact) => {
    setContacts([...contacts, newContact]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Contacts</h1>

      {/* Search and Sort Controls */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Sort {sortOrder === "asc" ? "↓" : "↑"}
        </button>
      </div>

      {/* Add Contact Form */}
      <div className="mb-6">
        <AddContactForm onAdd={addContact} />
      </div>

      {/* Contact Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedContacts.map((contact) => (
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

      {/* Contact Detail Modal */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">{selectedContact.name}</h2>
              <p>
                <strong>Email:</strong> {selectedContact.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedContact.phone}
              </p>
              <button
                onClick={() => setSelectedContact(null)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contacts;

// Reusable AddContactForm Component
const AddContactForm: React.FC<{ onAdd: (contact: Contact) => void }> = ({
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleAddContact = () => {
    if (name && email && phone) {
      const newContact: Contact = {
        id: Date.now(),
        name,
        email,
        phone,
      };
      onAdd(newContact);
      setName("");
      setEmail("");
      setPhone("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add Contact</h2>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleAddContact}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Contact
        </button>
      </div>
    </div>
  );
};
