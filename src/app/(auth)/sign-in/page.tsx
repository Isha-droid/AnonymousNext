// src/components/SignUpForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/schemas/signUpSchema'; // Import the schema
import Link from 'next/link';

export default function SignUpForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceValue(username, 300);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema), // Use the Zod resolver
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/sign-up', data);
      if (response.data.success) {
        router.replace(`/verify/${data.username}`);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data.message || 'Error signing up');
      } else {
        console.error('Error signing up:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkUsername = async () => {
    if (debouncedUsername) {
      setIsCheckingUsername(true);
      setUsernameMsg('');
      try {
        const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
        if (response.data.exists) {
          setUsernameMsg('Username is already taken');
        } else {
          setUsernameMsg('Username is available');
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameMsg('Error checking username');
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  useEffect(() => {
    if (debouncedUsername) {
      checkUsername();
    }
  }, [debouncedUsername]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Join Us</h1>
          <p className="mt-2 text-gray-600">Create an account to start using our services</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email"
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                {...register("username")}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameMsg && <p className="mt-2 text-sm text-red-600">{usernameMsg}</p>}
              {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isCheckingUsername || isSubmitting}
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already a member?{' '}
            <Link href="/sign-in">
              <div className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </div>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
