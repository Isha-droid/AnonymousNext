"use client";
import React, { useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { FiTrash2 } from 'react-icons/fi';

interface MessageCardProps {
  sender: string;
  message: string;
  timestamp: string;
  onDelete: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ sender, message, timestamp, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsMenuOpen(false);
  };

  return (
    <div className="relative max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden my-4 border border-gray-300 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaRegComment className="text-indigo-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">{sender}</h2>
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
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="text-right text-sm text-gray-500">{timestamp}</div>
      </div>
    </div>
  );
}

export default MessageCard;
