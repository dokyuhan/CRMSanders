import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, CircularProgress, Alert, Box, Typography } from '@mui/material';
import { dataProvider } from '../dataProvider';


const EditContact: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [contact, setContact] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: ''
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const { data } = await dataProvider.getOne('contacts', { id });
                setContact(data);
                setLoading(false);
            } catch (err) {
                setError('Error al obtener el contacto');
                setLoading(false);
            }
        };

        fetchContact();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            
            await dataProvider.update('contacts', { id, data: contact });
            navigate('/');
        } catch (err) {
            setError('Error al actualizar el contacto');
        }
    };

    if (loading) return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ textAlign: 'center', mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Editar Contacto
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
                <Button type="submit" variant="contained" fullWidth>Actualizar</Button>
            </Box>
        </Container>
    );
};

export default EditContact;
