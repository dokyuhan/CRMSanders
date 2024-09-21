import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, FormControl, FormControlLabel, Radio, RadioGroup, Typography, Box, Card, CardContent, Alert } from '@mui/material';
import axios from 'axios';
import { dataProvider } from './dataProvider';

const PaymentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [confirmation, setConfirmation] = useState(null);

  const onSubmit = async (data) => {
    try {
      // Use the dataProvider.create method to send a POST request
      const { data: responseData } = await dataProvider.create('donate', {
        data: {
          usuario_id: 1,
          monto: data.amount,
          metodo_pago: paymentMethod,
        }
      });

      setConfirmation(responseData);
      console.log('response:', responseData);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          Proceso de Pago
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl component="fieldset" margin="normal">
            <Typography variant="h6" component="legend">
              Método de Pago
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              row
            >
              <FormControlLabel value="credit" control={<Radio />} label="Tarjeta de Crédito/Débito" />
              <FormControlLabel value="Transferencia bancaria" control={<Radio />} label="Transferencia bancaria" />
              <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
            </RadioGroup>
          </FormControl>

          {paymentMethod === 'credit' && (
            <Box>
              <TextField
                label="Número de Tarjeta"
                variant="outlined"
                fullWidth
                {...register('cardNumber', { required: 'Número de tarjeta es requerido' })}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber ? errors.cardNumber.message : ''}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Fecha de Expiración"
                variant="outlined"
                fullWidth
                {...register('expiryDate', { required: 'Fecha de expiración es requerida' })}
                error={!!errors.expiryDate}
                helperText={errors.expiryDate ? errors.expiryDate.message : ''}
                sx={{ mb: 2 }}
              />
              <TextField
                label="CVV"
                variant="outlined"
                fullWidth
                {...register('cvv', { required: 'CVV es requerido' })}
                error={!!errors.cvv}
                helperText={errors.cvv ? errors.cvv.message : ''}
                sx={{ mb: 2 }}
              />
            </Box>
          )}

          {paymentMethod === 'Transferencia bancaria' && (
            <TextField
              label="Clave de Banco"
              variant="outlined"
              fullWidth
              {...register('bankKey', { required: 'Clave de banco es requerida' })}
              error={!!errors.bankKey}
              helperText={errors.bankKey ? errors.bankKey.message : ''}
              sx={{ mb: 2 }}
            />
          )}

          {paymentMethod === 'paypal' && (
            <TextField
              label="Correo Electrónico de PayPal"
              variant="outlined"
              fullWidth
              {...register('paypalEmail', { required: 'Correo electrónico es requerido' })}
              error={!!errors.paypalEmail}
              helperText={errors.paypalEmail ? errors.paypalEmail.message : ''}
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            label="Monto"
            variant="outlined"
            type="number"
            step="0.01"
            fullWidth
            {...register('amount', { required: 'Monto es requerido' })}
            error={!!errors.amount}
            helperText={errors.amount ? errors.amount.message : ''}
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Pagar
          </Button>
        </form>

        {confirmation && (
          <Box mt={2}>
            <Alert severity="success">
              <Typography variant="h6">
                Donación exitosa!
              </Typography>
              <Typography>ID de Donación: {confirmation.id}</Typography>
              <Typography>Monto: ${confirmation.monto}</Typography>
              <Typography>Método de Pago: {confirmation.metodo_pago}</Typography>
              <Typography>Fecha de Donación: {new Date(confirmation.fecha_donacion).toLocaleString()}</Typography>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
