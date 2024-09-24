import React from 'react';
import { useForm } from 'react-hook-form';

export default function SignIn() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("SignIn Data:", data);
    // Lógica para enviar los datos al backend y autenticar al usuario
  };

  return (
    <>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email:</label>
        <input type="email" {...register('email')} required />

        <label>Password:</label>
        <input type="password" {...register('password')} required />

        <button type="submit">Login</button>
      </form>
    </>
  );
}
