import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { dataProvider } from '../dataProvider'; 

const CreateDonation: React.FC = () => {
    const navigate = useNavigate();
    const [donation, setDonation] = useState({
        usuario_id: '',
        monto: '',
        metodo_pago: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDonation({ ...donation, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Usamos el dataProvider para crear la donación
            await dataProvider.create('donate', { data: donation });
            navigate('/donadores'); // Redirigir a la lista de donaciones
        } catch (err) {
            console.error('Error al crear la donación', err);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Button variant="contained" onClick={() => navigate('/donadores')} sx={{ mb: 3 }}>Volver</Button>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Crear Donación
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Usuario ID"
                    name="usuario_id"
                    value={donation.usuario_id}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Monto"
                    name="monto"
                    type="number"
                    value={donation.monto}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Método de Pago"
                    name="metodo_pago"
                    value={donation.metodo_pago}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth>Crear</Button>
            </Box>
        </Container>
    );
};

export default CreateDonation;
