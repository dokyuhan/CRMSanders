import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Box, CircularProgress, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';

interface Donacion {
    donacion_id: number;
    donador_nombre: string;
    donador_correo: string;
    donacion_monto: number;
    donacion_metodo_pago: string;
    donacion_fecha: string;
}

const Donadores: React.FC = () => {
    const [donaciones, setDonaciones] = useState<Donacion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDonaciones = async () => {
            try {
                const response = await axios.get('https://localhost:3003/donacionesdonadores');
                setDonaciones(response.data.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        fetchDonaciones();
    }, []);

    if (loading) return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ textAlign: 'center', mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Lista de donadores
            </Typography>
            <Grid container spacing={3}>
                {donaciones.map(donacion => (
                    <Grid item xs={12} sm={6} md={4} key={donacion.donacion_id}>
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
                                    {donacion.donador_nombre}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <EmailIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        {donacion.donador_correo}
                                    </Typography>
                                </Box>
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
