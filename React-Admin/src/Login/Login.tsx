import React, { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(to right, #3D2DD4, #3D2DD4);
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const FormContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 700px;
  backdrop-filter: blur(5px);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const ImageContainer = styled.div`
  flex: 1;
  padding: 10px;
  img {
    width: 100%;
    max-width: 200px;
    height: auto;
    border-radius: 8px;
  }
`;

const Input = styled.input`
  width: 100%;
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

const RegisterLink = styled.p`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #333;

  a {
    color: #333;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
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
        <FormContainer>
          <ImageContainer>
            <img style={{ width: '450px' }} src="/public/Logo_sanders.jpeg" alt="Logo Sanders" />
          </ImageContainer>
          <InputContainer>
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
            <RegisterLink>
              No tienes una cuenta? <Link to = "/register" style={{ fontWeight: 'bold' }} > Regístrate </Link>
            </RegisterLink>
          </InputContainer>
        </FormContainer>
      </LoginContainer>
    </>
  );
};

export default LoginPage;
