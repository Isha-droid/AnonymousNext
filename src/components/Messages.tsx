"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MessageCard from './MessageCard';
import { MessageInterface } from './MessageInterface'; // Assuming MessageInterface is properly defined
import { ApiResponse } from '@/types/ApiResponse';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState<boolean>(false);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setIsAcceptingMessages(response.data.isAcceptingMessages || false);

      if (response.data.isAcceptingMessages) {
        const messagesResponse = await axios.get<MessageInterface[]>('/api/get-messages');
        setMessages(messagesResponse.data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert("An error occurred while fetching status.");
    }
  }, []); // Empty dependency array since fetchMessages does not depend on any props or state

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (messageId: string) => {
    try {
      await axios.delete(`/api/delete-message/${messageId}`);
      setMessages(messages.filter(message => message._id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const toggleAcceptingMessages = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/toggle-accept-messages');
      setIsAcceptingMessages(response.data.isAcceptingMessages || false);
    } catch (error) {
      console.error('Error toggling message accepting state:', error);
      alert("An error occurred while toggling message accepting state.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-100 to-indigo-200 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="flex items-center mb-4">
        {/* Toggle Switch Button */}
        <button
          className={`relative inline-flex flex-shrink-0 h-6 w-12 border-2 border-transparent rounded-full cursor-pointer transition-colors ${isAcceptingMessages ? 'bg-green-400' : 'bg-gray-200'}`}
          onClick={toggleAcceptingMessages}
          aria-pressed={isAcceptingMessages ? 'true' : 'false'}
          role="switch"
        >
          {/* Switch Handle */}
          <span
            className={`pointer-events-none absolute inset-0 h-full w-full flex items-center justify-center transition-transform transform ${isAcceptingMessages ? 'translate-x-6' : 'translate-x-0'}`}
            aria-hidden="true"
          >
            <span
              className={`h-4 w-4 bg-white rounded-full shadow-md border ${isAcceptingMessages ? 'border-green-500' : 'border-gray-300'}`}
            />
          </span>
        </button>
        <span className="ml-2">{isAcceptingMessages ? 'Accepting Messages' : 'Not Accepting Messages'}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map(msg => (
          <MessageCard
            key={msg._id}
            messageId={msg._id}
            message={msg.content}
            timestamp={new Date(msg.createdAt).toLocaleString()}
            onDelete={() => handleDelete(msg._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Messages;
