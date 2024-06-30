"use client"
import React from 'react';

const Home = () => {

  // const handleGetStarted = () => {
  //   router.push('/dashboard');
  // };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-100 to-indigo-200">
      <h1 className="text-5xl font-bold text-white mb-8 animate-fade-in">Welcome to Anonymous App</h1>
      <p className="text-lg text-white mb-8 text-center max-w-xl animate-fade-in">
        Discover a new way to connect and share your thoughts anonymously. Join our community and get started on your journey today.
      </p>
      <button 
        className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition duration-300 animate-fade-in"
        
      >
        Get Started
      </button>
    </div>
  );
}

export default Home;
