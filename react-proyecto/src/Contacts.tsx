import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, Card, CardContent, CircularProgress, Alert } from '@mui/material';

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
                const response = await axios.get('https://localhost:3003/contacts');
                setContacts(response.data.data); 
                setLoading(false);
            } catch (err) {
                setError('Error al obtener los contactos');
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) return <Container><CircularProgress /></Container>;
    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Lista de Contactos
            </Typography>
            <List>
                {contacts.map(contact => (
                    <ListItem key={contact.id} disableGutters>
                        <Card variant="outlined" sx={{ width: '100%', marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6">
                                    {contact.nombre} {contact.apellido}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Email: {contact.email}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Teléfono: {contact.telefono}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Dirección: {contact.direccion}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Fecha de creación: {new Date(contact.fecha_creacion).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Contacts;
