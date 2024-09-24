import React from 'react';
import { useForm } from 'react-hook-form';
import { useLogin, useNotify } from 'react-admin'; 
import './css/SignIn.css'; 

export default function SignIn() {
  const { register, handleSubmit } = useForm();
  const login = useLogin(); 
  const notify = useNotify(); 

  const onSubmit = async (data: any) => {
    try {
      await login({ username: data.email, password: data.password });
    } catch (error) {
      notify('Credenciales inválidas');
    }
  };

  return (
    <div className="background">
      <div className="form">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email:</label>
          <input type="email" {...register('email')} required />

          <label>Password:</label>
          <input type="password" {...register('password')} required />

          <button type="submit">Login</button>

          <p>No tienes una cuenta? <a href="/SignUp">Regístrate</a></p>
        </form>
      </div>
    </div>
  );
}
