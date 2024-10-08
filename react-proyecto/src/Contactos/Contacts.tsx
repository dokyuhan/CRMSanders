import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import { dataProvider } from '../dataProvider';

interface Contact {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    fecha_creacion: string;
}

const Contacts: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await dataProvider.getList('contacts', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });
                console.log("Received data:", response);
                if (!Array.isArray(response.data.data)) {
                    throw new Error(`Expected data.data to be an array, received ${typeof response.data.data}`);
                }
                setContacts(response.data.data);
            } catch (err) {
                console.error("Error fetching contacts:", err);
                setError(err.message || 'Error al obtener los contactos');
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ textAlign: 'center', mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Lista de Contactos
            </Typography>
            <Button variant="contained" component={Link} to="/create-contact" sx={{ mb: 3 }}>Crear Contacto</Button>
            <Grid container spacing={3}>
                {contacts.map(contact => (
                    <Grid item xs={12} sm={6} md={4} key={contact.id}>
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
                                    {contact.nombre} {contact.apellido}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <EmailIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        {contact.email}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PhoneIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        {contact.telefono}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <HomeIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        {contact.direccion}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <EventIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        Fecha de creación: {new Date(contact.fecha_creacion).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Button variant="outlined" component={Link} to={`/edit-contact/${contact.id}`} sx={{ mt: 1 }}>
                                    Editar
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Contacts;
