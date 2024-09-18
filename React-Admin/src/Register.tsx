import React, { useState } from 'react';
import { useNotify, useRedirect } from 'react-admin';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3003/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        notify('Registration successful');
        redirect('/login');
      } else {
        notify(data.msg || 'Registration failed');
      }
    } catch (error) {
      notify('Registration failed');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
        <form 
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-lg flex flex-col"
        >
          <div className="flex flex-col w-full">
            <input
              className="w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 bg-white bg-opacity-80 shadow-md focus:border-blue-600 focus:outline-none transition-colors duration-300"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              type="text"
              required
            />
            <input
              className="w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 bg-white bg-opacity-80 shadow-md focus:border-blue-600 focus:outline-none transition-colors duration-300"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
            />
            <input
              className="w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 bg-white bg-opacity-80 shadow-md focus:border-blue-600 focus:outline-none transition-colors duration-300"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform transform hover:translate-y-0.5 duration-300"
            >
              Register
            </button>
            <p className="mt-4 text-center text-gray-700 text-sm">
              Regresar al inicio de sesión?{' '}
              <Link to="/login" className="font-semibold text-gray-900 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
