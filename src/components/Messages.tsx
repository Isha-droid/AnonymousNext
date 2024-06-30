"use client";
import React, { useState, useEffect } from 'react';
import MessageCard from './MessageCard';

// Define the Message interface
interface Message {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Fetch messages from an API or data source
    const fetchedMessages: Message[] = [
      { id: 1, sender: 'John Doe', message: 'Hello! How are you?', timestamp: '2024-06-28 10:00 AM' },
      { id: 2, sender: 'Jane Smith', message: 'Can we meet tomorrow?', timestamp: '2024-06-28 11:00 AM' },
      // Add more messages here...
    ];
    setMessages(fetchedMessages);
  }, []);

  const handleDelete = (id: number) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-100 to-indigo-200 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((msg) => (
          <MessageCard 
            key={msg.id} 
            sender={msg.sender} 
            message={msg.message} 
            timestamp={msg.timestamp} 
            onDelete={() => handleDelete(msg.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Messages;
