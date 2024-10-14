import React, { useState } from 'react';
import { useNotify } from 'react-admin';
import { Link } from 'react-router-dom';
import { dataProvider } from '../dataProvider';

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
      const response = await dataProvider.create('registercolab', {
        data: { username, password, email, role },
      });
      
      if (response) {
        setRegistrationSuccess(true);
        notify('Registro exitoso');
      }
    } catch (error) {
      notify('Error en el registro');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-lg flex flex-col">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Registro de Usuarios</h1>
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col w-full"
        >
          {registrationSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
              ¡Registro exitoso!
            </div>
          )}
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
            <option value="donador"> Donador</option>
          </select>
          <button
              type="submit"
              className="w-full py-3 bg-[#207CCD] text-white rounded-md hover:bg-[#1b6cab] transition-transform transform hover:-translate-y-0.5 duration-300"
          >
            Registrar Colaborador
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registercolab;
