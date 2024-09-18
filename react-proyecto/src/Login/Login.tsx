import React, { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login({ username, password });
    } catch (error) {
      notify('Invalid credentials');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-md w-full max-w-4xl flex">
          <div className="flex-1 p-4">
            <img 
              className="w-full max-w-xs rounded-lg"
              src="/public/Logo_sanders.jpeg" 
              alt="Logo Fundación Sanders" 
            />
          </div>
          <div className="flex-1 flex flex-col mx-4 justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                className="bg-white bg-opacity-80 shadow-md w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 focus:border-blue-600 focus:outline-none transition-colors duration-300"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                type="text"
                required
              />
              <input
                className="bg-white bg-opacity-80 shadow-md w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 focus:border-blue-600 focus:outline-none transition-colors duration-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform transform hover:translate-y-0.5 duration-300"
              >
                Log In
              </button>
            </form>
            <p className="mt-4 text-center text-gray-700 text-sm">
              No tienes una cuenta?{' '}
              <Link to="/register" className="font-semibold text-gray-900 hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
