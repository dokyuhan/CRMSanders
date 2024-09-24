import React from 'react';
import { useForm } from 'react-hook-form';
import './css/SignUp.css';

export default function SignUp() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("SignUp Data:", data);
    // Lógica para enviar los datos al backend y crear una cuenta
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
                    <input type="email" {...register('email')} placeholder='juanperez@mail.com'required />

                    <label>Contraseña:</label>
                    <input type="password" {...register('password')} placeholder='••••••'required />

                    <button type="submit">Registrarse</button>
                    
                    <p>Ya tienes una cuenta? <a href="/SignIn">Inicia sesión</a></p>
                </form>
            </div>
        </div>
      
    </>
  );
}
