import React, { useState } from 'react';
import { useNotify } from 'react-admin';
import { Link } from 'react-router-dom';
const Registercolab: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const notify = useNotify();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('https://localhost:3003/registercolab', { 
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
      } else {
        notify(data.msg || 'Error en el registro');
      }
    } catch (error) {
      notify('Error en el registro');
    }
  };
  return (
    <div className='flex flex-col md:flex-row gap-8 m-4'>
      <div className='flex-1'>
        <form 
          onSubmit={handleSubmit} 
          className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-lg flex flex-col"
        >
          {registrationSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
              ¡Registro exitoso!
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
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform transform hover:translate-y-0.5 duration-300"
            >
              Registrar Colaborador
            </button>
          </div>
        </form>
      </div>
      <div className='bg-gray-500 flex-1 text-white rounded-lg'>
        <h1 className='text-xl font-bold p-6 bg-gray-700 rounded-t-lg'>¡Registra un nuevo colaborador!</h1>
        <div className='p-8'>
          <p className='mt-4'>
            Aquí puedes registrar nuevos colaboradores que te ayudarán a gestionar la plataforma.
            Asegúrate de completar todos los campos correctamente.
          </p>
          <div className='p-6'>
            <p className='mt-4'>Una vez registrado:</p>
            <ul className='list-disc list-inside'>
              <li>El colaborador podrá iniciar sesión</li>
              <li>Podrá gestionar contactos y empresas</li>
              <li>Recibirá un correo de confirmación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Registercolab;