"use client"
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';

interface VerifyOTPFormInputs {
  otp: string;
}

const VerifyOTP = () => {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyOTPFormInputs>({
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (data: VerifyOTPFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await axios.post('/api/verifyCode', { username: encodeURIComponent(username), code: data.otp });
      if (response.data.success) {
        router.replace('/success');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.message || 'Error verifying OTP');
      } else {
        console.error('Error verifying OTP:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Verify OTP</h1>
          <p className="mt-2 text-gray-600">Enter the OTP sent to your email</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                id="otp"
                type="text"
                {...register('otp', { required: 'OTP is required' })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="OTP"
              />
              {errors.otp && <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>}
            </div>
          </div>
          {errorMessage && <p className="mt-2 text-sm text-red-600 text-center">{errorMessage}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Verify OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
