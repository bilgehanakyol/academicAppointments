import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button';

const EmailVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('/auth/verify-email', {
        token: verificationCode,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Invalid verification code.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Email Verification
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter your verification code"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <Button type="submit">Verify Email</Button>
        </form>
        {error && (
          <p className="mt-4 text-center text-red-500 font-semibold">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 text-center text-green-500 font-semibold">
            Email verified successfully! Redirecting...
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
