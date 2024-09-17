import React, { useState } from 'react';
import { useNotify, useRedirect } from 'react-admin';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(to right, #3D2DD4, #3D2DD4);
  }
`;

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const FormContainer = styled.form`  // Cambiado de div a form para permitir el envío de formulario
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(5px);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  width: 90%;
  padding: 15px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 2px solid #ccc;
  font-size: 16px;
  background: none;
  color: #333;

  &:focus {
    border-bottom-color: #0056b3;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 0;
  background-color: #1492FF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0466E6;
    transform: translateY(-5px);
  }
`;

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); 
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3003/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        notify('Registration successful');
        redirect('/login');
      } else {
        notify(data.msg || 'Registration failed');
      }
    } catch (error) {
      notify('Registration failed');
    }
  };

  return (
    <>
      <GlobalStyle />
      <RegisterContainer>
        <FormContainer onSubmit={handleSubmit}>
          <InputContainer>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              type="text"
              required
            />
            <Input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
            />
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)} 
              placeholder="Email"
              type="email" 
            />
            <Button type="submit">Register</Button>
          </InputContainer>
        </FormContainer>
      </RegisterContainer>
    </>
  );
};

export default RegisterPage;
