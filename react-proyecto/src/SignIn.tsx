import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Card, CardContent, Alert } from '@mui/material';
import { useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import './css/SignIn.css';

const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const notify = useNotify();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://localhost:3003/loginDonor', {
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
        throw new Error('Credenciales inválidas');
      }

      const responseData = await response.json();
      localStorage.setItem('auth', JSON.stringify(responseData));
      notify('Inicio de sesión exitoso');
      
      navigate('/donate');

    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error);
      setError(error.message || 'Error desconocido');
      notify('Error en el inicio de sesión: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="background">
      <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Iniciar sesión
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              {...register('email', { required: 'El correo es requerido' })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Contraseña"
              variant="outlined"
              type="password"
              fullWidth
              {...register('password', { required: 'La contraseña es requerida' })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error">{error}</Alert>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            <p>No tienes una cuenta? <a href="/SignUp">Regístrate</a></p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
