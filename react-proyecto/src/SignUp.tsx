import React from 'react';
import { useForm } from 'react-hook-form';

export default function SignUp() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("SignUp Data:", data);
    // Lógica para enviar los datos al backend y crear una cuenta
  };

  return (
    <>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>First Name:</label>
        <input {...register('firstName')} required />
        
        <label>Last Name:</label>
        <input {...register('lastName')} required />

        <label>Email:</label>
        <input type="email" {...register('email')} required />

        <label>Password:</label>
        <input type="password" {...register('password')} required />

        <button type="submit">Register</button>
      </form>
    </>
  );
}
