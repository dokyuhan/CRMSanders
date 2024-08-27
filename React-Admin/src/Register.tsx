import React, { useState } from 'react';
import { useNotify } from 'react-admin';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;

  form {
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 20px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    border-color: #85b7d9;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 0;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #003d7a;
  }
`;

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const notify = useNotify();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {

      notify('Registration successful');
    } catch (error) {
      notify('Registration failed');
    }
  };

  return (
    <RegisterContainer>
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
        <Button type="submit">Register</Button>
      </form>
    </RegisterContainer>
  );
};

export default RegisterPage;
