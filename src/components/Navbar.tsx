"use client"; // Ensure the component runs on the client-side

import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
      <div className="text-xl font-bold cursor-pointer hover:text-pink-500 transition duration-300">
        <Link href="/">Anonymous App</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/" className="hover:text-pink-500 transition duration-300">Home</Link>
        <Link href="/dashboard" className="hover:text-pink-500 transition duration-300">Dashboard</Link>
        {session ? (
          <>
            <div className="flex items-center">
              <FaUserCircle className="mr-2" />
              <span>{session.user.username}</span>
            </div>
            <button 
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition duration-300"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/sign-in">
  <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition duration-300">
    Login
  </button>
</Link>

        )}
      </div>
    </div>
  );
}

export default Navbar;
