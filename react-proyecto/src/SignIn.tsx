import React from 'react';
import { useForm } from 'react-hook-form';
import { useNotify } from 'react-admin';
import './css/SignIn.css'; 

export default function SignIn() {
  const { register, handleSubmit } = useForm();
  const notify = useNotify(); 

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/SignIn', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email, 
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const responseData = await response.json();
      notify(responseData.message); 
    } catch (error) {
      notify('Error en el inicio de sesión: ' + error.message);
    }
  };

  return (
    <div className="background">
      <div className="form">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email:</label>
          <input type="email" {...register('email')} required />

          <label>Contraseña:</label>
          <input type="password" {...register('password')} required />

          <button type="submit">Iniciar sesión</button>

          <p>No tienes una cuenta? <a href="/SignUp">Regístrate</a></p>
        </form>
      </div>
    </div>
  );
}
