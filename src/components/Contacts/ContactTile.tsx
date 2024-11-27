import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  details: string;
}

const ContactTile: React.FC<Contact> = ({
  id,
  name,
  phone,
  email,
  details,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative">
      {/* Tile */}
      <motion.div
        className="bg-blue-100 p-4 rounded-lg shadow-md cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        <h3 className="text-lg font-bold">{name}</h3>
        <p>{phone}</p>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsModalOpen(false)} // Close on background click
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
            >
              <h2 className="text-xl font-bold mb-4">{name}</h2>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> {phone}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> {email}
              </p>
              <p className="text-gray-700">
                <strong>Details:</strong> {details}
              </p>
              <button
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => setIsModalOpen(false)}
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

export default ContactTile;
