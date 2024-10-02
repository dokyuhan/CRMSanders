import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { dataProvider } from '../dataProvider'; 

const CreateContact: React.FC = () => {
    const navigate = useNavigate();
    const [contact, setContact] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Usamos el dataProvider para crear el contacto
            await dataProvider.create('contacts', { data: contact });
            navigate('/');
        } catch (err) {
            console.error('Error al crear el contacto');
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Crear Contacto
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Nombre"
                    name="nombre"
                    value={contact.nombre}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Apellido"
                    name="apellido"
                    value={contact.apellido}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Teléfono"
                    name="telefono"
                    value={contact.telefono}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Dirección"
                    name="direccion"
                    value={contact.direccion}
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

export default CreateContact;
