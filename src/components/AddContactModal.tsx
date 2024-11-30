import React, { useState } from "react";
import { motion } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { IoClose } from "react-icons/io5";
import { Contact } from "../types"; // Shared Contact type

const AddContactModal: React.FC<{
  onClose: () => void;
  // onAdd: (contact: Contact) => void;
}> = ({
  onClose,
  // , onAdd
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phones, setPhones] = useState<string[]>([""]);
  const [birthday, setBirthday] = useState("");
  const [company, setCompany] = useState("");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleAddPhone = () => {
    setPhones([...phones, ""]);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updatedPhones = [...phones];
    updatedPhones[index] = value;
    setPhones(updatedPhones);
  };

  const handleRemovePhone = (index: number) => {
    setPhones((prevPhones) => prevPhones.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("User is not authenticated.");
      return;
    }

    // Construct the new contact object
    const newContact: Partial<Contact> = {
      name: name.trim(),
      email: email.trim() || undefined,
      phones: phones.filter((phone) => phone.trim()),
      birthday: birthday.trim() || undefined,
      company: company.trim() || undefined,
      dateCreated: new Date().toISOString(),
      createdBy: userId, // Include createdBy for the Firestore rule
    };

    // Remove undefined fields
    const sanitizedContact = Object.fromEntries(
      Object.entries(newContact).filter(([_, value]) => value !== undefined)
    );

    try {
      const docRef = await addDoc(collection(db, "contacts"), sanitizedContact);
      // onAdd({ id: docRef.id, ...sanitizedContact });
      onClose(); // Close modal after adding
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Failed to add contact. Please try again.");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-md p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Add Contact</h2>
        <div className="space-y-4">
          {/* Name Field (Required) */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Email Field (Optional) */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Phone Fields */}
          <div className="space-y-2">
            {phones.map((phone, index) => (
              <div key={index}>
                <label className="block text-sm font-semibold mb-1">
                  Phone{index ? ` #${index + 1}` : null}
                </label>

                <div className="flex items-center space-x-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => handleRemovePhone(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <IoClose className="text-xl" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {phones[phones.length - 1].trim() && (
              <span
                onClick={handleAddPhone}
                className="text-blue-500 text-sm cursor-pointer hover:underline"
              >
                + Add Phone
              </span>
            )}
          </div>

          {/* Toggle Optional Fields */}
          <span
            onClick={() => setShowOptionalFields((prev) => !prev)}
            className="text-blue-500 text-sm cursor-pointer hover:underline"
          >
            {showOptionalFields
              ? "Hide Optional Fields"
              : "+ Add Optional Fields"}
          </span>

          {/* Optional Fields */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: showOptionalFields ? "auto" : 0,
              opacity: showOptionalFields ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>
          </motion.div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add Contact
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddContactModal;
