import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Card, CardContent, Alert } from '@mui/material';
import { useNotify } from 'react-admin'; 
import { dataProvider } from './dataProvider'; 
import './css/SignUp.css';

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const notify = useNotify(); 
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true); 
    setError(null); 

    try {
    
      const { data: responseData } = await dataProvider.create('registerDonor', {
        data: {
          name: data.firstName,
          surname: data.lastName,
          email: data.email,
          password: data.password,
        }
      });

     
      notify('Cuenta creada exitosamente');
    } catch (error) {
      console.error('Error en el registro:', error);
      setError('Error al registrarse. Por favor, inténtalo de nuevo.');
      notify('Error en el registro: ' + error.message);
    }
    
    setLoading(false); 
  };

  return (
    <div className='background'>
      <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Registrarse
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              {...register('firstName', { required: 'El nombre es requerido' })}
              error={!!errors.firstName}
              helperText={errors.firstName ? errors.firstName.message : ''}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Apellido"
              variant="outlined"
              fullWidth
              {...register('lastName', { required: 'El apellido es requerido' })}
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ''}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Correo electrónico"
              variant="outlined"
              type="email"
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
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>

            <p>¿Ya tienes una cuenta? <a href="/SignIn">Inicia sesión</a></p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
