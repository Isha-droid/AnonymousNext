"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import MessageCard from "./MessageCard";
import { MessageInterface } from "./MessageInterface"; // Assuming MessageInterface is properly defined
import { ApiResponse } from "@/types/ApiResponse";
import { useSession } from "next-auth/react";
import { User } from "@/models/User";

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState<boolean>(true);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const fetchAcceptingStatus = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setIsAcceptingMessages(response.data.isAcceptingMessages || false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      alert(axiosError.response?.data.message ?? "Failed to fetch message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      console.log(response)
      console.log(response.data.messages.message)
      setMessages(response.data.messages.message || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      alert(axiosError.response?.data.message ?? "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptingStatus();
    fetchMessages();
  }, [session, fetchAcceptingStatus, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !isAcceptingMessages,
      });
      setIsAcceptingMessages(!isAcceptingMessages);

      if (!isAcceptingMessages) {
        fetchMessages();
      } else {
        setMessages([]);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      alert(axiosError.response?.data.message ?? "Failed to update message settings");
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await axios.delete(`/api/delete-message/${messageId}`);
      setMessages(messages.filter((message) => message._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  let profileUrl;
  if(session?.user){

    const { username } = session?.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
     profileUrl = `${baseUrl}/u/${username}`;
  }
  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    alert("URL copied");
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-100 to-indigo-200 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="flex items-center mb-4 space-x-4">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2"
        />
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded "
          onClick={copyToClipboard}
        >
          Copy
        </button>
        <button
          className={`relative inline-flex flex-shrink-0 h-8 w-16 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
            isAcceptingMessages ? "bg-pink-500" : "bg-gray-300"
          }`}
          onClick={handleSwitchChange}
          aria-pressed={isAcceptingMessages ? "true" : "false"}
          role="switch"
        >
          <span
            className={`absolute left-0 inline-block h-6 w-6 border-2 border-transparent rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out ${
              isAcceptingMessages ? "translate-x-8" : "translate-x-0"
            }`}
          />
          <span
            className={`absolute inset-y-0 left-0 flex items-center justify-center w-8 h-full ${
              isAcceptingMessages ? "text-white" : "text-gray-500"
            } text-sm font-semibold`}
          >
            {isAcceptingMessages ? "ON" : "OFF"}
          </span>
        </button>
      </div>
      <div className="flex flex-col justify-center">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageCard
              key={msg._id}
              messageId={msg._id}
              message={msg.content}
              timestamp={new Date(msg.createdAt).toLocaleString()}
              onDelete={() => handleDelete(msg._id)}
            />
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500">
            No messages to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
