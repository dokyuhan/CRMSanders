import React, { useEffect, useState } from 'react';
import { useNotify } from 'react-admin';
import { Link, useNavigate} from 'react-router-dom';
import { authProvider } from './Authenticator';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const notify = useNotify();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    try {
        await authProvider.login({ username, password });
        console.log('Login successful');
        
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 500);
      } catch (error) {
        console.log("Error", error);
        setErrorMessage('Usuario o contraseña incorrecta'); 
      }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #f0f0f0 50%, #c4c4c4 50%)',
      }}
    >
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
            {errorMessage && ( 
              <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
            )}
            <input
              className="bg-white bg-opacity-80 shadow-md w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 focus:border-blue-600 focus:outline-none transition-colors duration-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              type="text"
              required
            />
            <input
              className="bg-white bg-opacity-80 shadow-md w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 focus:border-blue-600 focus:outline-none transition-colors duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              type="password"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform transform hover:translate-y-0.5 duration-300"
            >
              Iniciar sesión
            </button>
          </form>
          <p className="mt-4 text-center text-gray-700 text-sm">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-semibold text-gray-900 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;
