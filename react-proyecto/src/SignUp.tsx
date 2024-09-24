import React from 'react';
import { useForm } from 'react-hook-form';
import { useNotify } from 'react-admin';
import './css/SignUp.css';

export default function SignUp() {
  const { register, handleSubmit } = useForm();
  const notify = useNotify(); 

  const onSubmit = async (data: any) => {
    try {
     
      console.log("SignUp Data:", data);
      
     
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al registrarse');
      }

      
      notify('Cuenta creada exitosamente');
    } catch (error) {
     
      notify('Error en el registro: ' + error.message);
    }
  };

  return (
    <>
      <div className='background'>
        <div className='signUpform'>
          <h2>Registrarse</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Nombre:</label>
            <input {...register('firstName')} placeholder='Juan' required />
            
            <label>Apellido:</label>
            <input {...register('lastName')} placeholder='Perez' required />

            <label>Correo electrónico:</label>
            <input type="email" {...register('email')} placeholder='juanperez@mail.com' required />

            <label>Contraseña:</label>
            <input type="password" {...register('password')} placeholder='••••••' required />

            <button type="submit">Registrarse</button>
            
            <p>Ya tienes una cuenta? <a href="/SignIn">Inicia sesión</a></p>
          </form>
        </div>
      </div>
    </>
  );
}
