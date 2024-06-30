"use client"
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import { FaRegComment } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { FiTrash2 } from 'react-icons/fi';

interface MessageCardProps {
  messageId: string;
  message: string;
  timestamp: string;
  onDelete: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ messageId, message, timestamp, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // Optimistic UI: Remove message from UI immediately
      onDelete();

      // Send delete request to API
      await axios.delete(`/api/delete-message/${messageId}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      // Handle error (e.g., show error message, rollback UI change)
      // For simplicity, you can add logic to revert UI changes if delete fails
    } finally {
      setIsMenuOpen(false); // Close delete confirmation menu
    }
  };

  return (
    <div className="relative max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden my-4 border border-gray-300 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaRegComment className="text-indigo-500 mr-3" />
            <p className="text-gray-700">{message}</p>
          </div>
          <div className="relative">
            <BsThreeDots
              className="text-gray-500 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">{timestamp}</div>
      </div>
    </div>
  );
};

export default MessageCard;
