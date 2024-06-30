"use client"
import React, { useState, useEffect } from 'react';
import MessageCard from './MessageCard';
import axios from 'axios';

interface Message {
  id: number;
  message: string;
  timestamp: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>('/api/get-messages');
        setMessages(response.data.map((msg, index) => ({
          id: index + 1, // Assign a unique ID for each message
          message: msg.content,
          timestamp: msg.createdAt.toLocaleString(), // Adjust timestamp format as needed
        })));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = (id: number) => {
    setMessages(messages.filter((message) => message.id !== id));
    // Add logic to delete message via API if required
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-100 to-indigo-200 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((msg) => (
          <MessageCard
            key={msg.id}
            message={msg.message}
            timestamp={msg.timestamp}
            onDelete={() => handleDelete(msg.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Messages;
