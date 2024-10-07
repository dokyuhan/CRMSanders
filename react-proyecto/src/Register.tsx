import React, { useState } from 'react';
import { useNotify, useRedirect } from 'react-admin';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false); 
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('https://localhost:3003/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistrationSuccess(true); 
        notify('Registro exitoso'); 
        setTimeout(() => {
          redirect('/login');
        }, 2000);
      } else {
        notify(data.msg || 'Error en el registro');
      }
    } catch (error) {
      notify('Error en el registro');
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #f0f0f0 50%, #c4c4c4 50%)', 
        }}
      >
        <form 
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-lg flex flex-col"
        >
          {registrationSuccess && ( 
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
              ¡Registro exitoso! Redirigiendo al inicio de sesión...
            </div>
          )}

          <div className="flex flex-col w-full">
            <input
              className="w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 bg-white bg-opacity-80 shadow-md focus:border-blue-600 focus:outline-none transition-colors duration-300"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Usuario"
              type="text"
              required
            />
            <input
              className="w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 bg-white bg-opacity-80 shadow-md focus:border-blue-600 focus:outline-none transition-colors duration-300"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              type="password"
              required
            />
            <input
              className="w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 bg-white bg-opacity-80 shadow-md focus:border-blue-600 focus:outline-none transition-colors duration-300"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              type="email"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform transform hover:translate-y-0.5 duration-300"
            >
              Registrar
            </button>
            <p className="mt-4 text-center text-gray-700 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-semibold text-gray-900 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
