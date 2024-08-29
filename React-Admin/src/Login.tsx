import React, { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif; /* Consider adding a Google Font link in your HTML */
    background: linear-gradient(to right, #6a11cb, #2575fc); /* Subtle gradient background */
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  form {
    padding: 40px;
    background: rgba(255, 255, 255, 0.8); /* Slight transparency */
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 360px;
    backdrop-filter: blur(5px); /* Blur effect for supported browsers */
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 2px solid #ccc; /* Minimalistic bottom border */
  border-radius: 0;
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
    transform: translateY(-5px); /* Slight lift */
  }
`;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login({ username, password });
    } catch (error) {
      notify('Invalid credentials');
    }
  };

  return (
    <>
      <GlobalStyle />
      <LoginContainer>
        <form onSubmit={handleSubmit}>
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
          <Button type="submit">Log In</Button>
        </form>
      </LoginContainer>
    </>
  );
};

export default LoginPage;
