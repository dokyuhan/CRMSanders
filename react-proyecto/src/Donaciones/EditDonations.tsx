import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, CircularProgress, Alert, Box, Typography } from '@mui/material';
import { dataProvider } from '../dataProvider';

const EditDonation: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [donation, setDonation] = useState({
        usuario_id: '',
        monto: '',
        metodo_pago: ''
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDonation = async () => {
            try {
                const { data } = await dataProvider.getOne('donaciones', { id });
                setDonation(data);
                setLoading(false);
            } catch (err) {
                setError('Error al obtener la donación');
                setLoading(false);
            }
        };

        fetchDonation();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDonation({ ...donation, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dataProvider.update('donaciones', { id, data: donation });
            navigate('/donaciones'); // Redirigir a la lista de donaciones
        } catch (err) {
            setError('Error al actualizar la donación');
        }
    };

    if (loading) return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ textAlign: 'center', mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container sx={{ mt: 4 }}>
            <Button variant="contained" onClick={() => navigate('/donaciones')} sx={{ mb: 3 }}>Volver</Button>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Editar Donación
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
                <Button type="submit" variant="contained" fullWidth>Actualizar</Button>
            </Box>
        </Container>
    );
};

export default EditDonation;
