'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import Link from 'next/link';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState<string>(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/send-message', {
        content: messageContent,
        username,
      });

      alert(response.data.message); // Replaced toast with alert

      setMessageContent('');
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError.response?.data.message ?? 'Failed to send message'); // Replaced toast with alert
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      // Simulated completion data
      setCompletion(initialMessageString);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const handleMessageClick = (message: string) => {
    setMessageContent(message);
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="content" className="block font-medium text-gray-700">
            Send Anonymous Message to @{username}
          </label>
          <textarea
            id="content"
            name="content"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Write your anonymous message here"
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500 resize-none"
            rows={5}
            required
          />
        </div>
        <div className="flex justify-center">
          {isLoading ? (
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              disabled
            >
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V2.5"
                />
              </svg>
              Please wait
            </button>
          ) : (
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition duration-300"
              disabled={!messageContent}
            >
              Send It
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <button
            onClick={fetchSuggestedMessages}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition duration-300"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </button>
          <p>Click on any message below to select it.</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Messages</h3>
          {error && <p className="text-red-500">{error}</p>}
          {parseStringMessages(completion).map((message, index) => (
            <button
              key={index}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition duration-300"
              onClick={() => handleMessageClick(message)}
            >
              {message}
            </button>
          ))}
        </div>
      </div>

      <hr className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href="/sign-up">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300">
            Create Your Account
          </button>
        </Link>
      </div>
    </div>
  );
}
