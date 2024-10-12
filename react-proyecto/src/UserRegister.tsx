import React, { useState } from 'react';
import { useNotify } from 'react-admin';
import { Link } from 'react-router-dom';
const Registercolab: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
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
        body: JSON.stringify({ username, password, email, role }),
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
             <select
              className="w-full p-4 mb-4 border-b-2 border-gray-400 text-gray-700 bg-white bg-opacity-80 shadow-md focus:border-blue-600 focus:outline-none transition-colors duration-300"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="colaborador">Colaborador</option>
              <option value="usuario">Usuario</option>
            </select>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform transform hover:translate-y-0.5 duration-300"
            >
              Registrar Colaborador
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
};
export default Registercolab;