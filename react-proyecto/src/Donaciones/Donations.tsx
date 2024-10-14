import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import { dataProvider } from '../dataProvider'; 


interface Donacion {
    id: number;
    usuario_id: number;
    usuario_nombre: string;
    usuario_correo:string;
    donacion_monto:string;
    donacion_fecha:string;
    donacion_metodo_pago:string;
}

const Donadores: React.FC = () => {
    const [donaciones, setDonaciones] = useState<Donacion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDonaciones = async () => {
            setLoading(true);
            try {
                const response = await dataProvider.getList<Donacion>('donacionesdonadores', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });
                const fetchedDonaciones = Array.isArray(response.data.rows) ? response.data.rows : [];
                setDonaciones(fetchedDonaciones);
            } catch (err) {
                console.error('Error fetching donaciones:', err);
                setError('Error al cargar las donaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchDonaciones();
    }, []);

    if (loading) {
        return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
    }

    if (error) {
        return <Container sx={{ textAlign: 'center', mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    }

    return (
        <Container sx={{ mt: 4 }} className="bg-gray-800 text-white p-4 rounded-lg p-6">
            <Typography variant="h4" component="h1" align="center" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Lista de Donadores
            </Typography>
            <Grid container spacing={3}>
                {donaciones.map((donacion) => (
                    <Grid item xs={12} sm={6} md={4} key={donacion.id}>
                        <Card 
                            variant="outlined" 
                            sx={{ 
                                boxShadow: 3, 
                                transition: 'transform 0.3s', 
                                '&:hover': { transform: 'scale(1.05)' } 
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Donador: {donacion.usuario_nombre}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        Monto: ${donacion.donacion_monto}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PaymentIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        Método de pago: {donacion.donacion_metodo_pago}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EventIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        Fecha de donación: {new Date(donacion.donacion_fecha).toLocaleString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Donadores;
