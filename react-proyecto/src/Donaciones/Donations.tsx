import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, TextField, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { dataProvider } from '../dataProvider';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Donadores: React.FC = () => {
    const [datos, setDatos] = useState({
        usuarioData: null,
        fechaData: []
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleSearch = async () => {
        if (!search.trim()) {
            setErrorMessage('Por favor ingrese un nombre de usuario válido.');
            setOpen(true);
            return;
        }
        setLoading(true);
        setErrorMessage(''); // Limpia cualquier mensaje de error anterior
        setOpen(false);
        try {
            const response = await dataProvider.getList('donacionesdonadores', {
                filter: { usuario_nombre: search },
            });
            if (response.data && response.data.usuarioData) {
                setDatos({
                    usuarioData: response.data.usuarioData,
                    fechaData: response.data.fechaData.map(d => ({
                        fecha: format(new Date(d.fecha), 'yyyy-MM-dd'),
                        total: parseFloat(d.total_donado_por_fecha)
                    }))
                });
            } else {
                setErrorMessage('No se encuentra el usuario');
                setOpen(true);
                setDatos({ usuarioData: null, fechaData: [] });
            }
        } catch (err) {
            console.error('Error fetching donaciones:', err);
            setErrorMessage('Error, usuario no encontrado');
            setOpen(true);
        }
        setLoading(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Container className="bg-gray-800 text-white p-4 rounded-lg p-6">
            <Typography variant="h4" sx={{ color: 'white' }}>Estadísticas del Donador</Typography>
            <TextField
                fullWidth
                label="Buscar Usuario por Nombre"
                value={search}
                onChange={handleSearchChange}
                margin="normal"
                InputLabelProps={{
                    style: { color: 'white' }
                }}
                inputProps={{
                    style: { color: 'white' }
                }}
            />
            <Button
                onClick={handleSearch}
                variant="contained"
                sx={{
                    mt: 1,
                    mb: 1,
                    backgroundColor: '#207CCD',
                    '&:hover': {
                        backgroundColor: '#1b6cab'
                    }
                }}
            >
                Buscar
            </Button>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            {datos.usuarioData && (
                <>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={datos.fechaData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip contentStyle={{ color: '#000', backgroundColor: '#fff' }} />
                            <Legend />
                            <Bar dataKey="total" fill="#2284C6" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div>
                        <p>Total Donado: ${datos.usuarioData.suma_donaciones}</p>
                        <p>Donación Máxima: ${datos.usuarioData.donacion_maxima}</p>
                    </div>
                </>
            )}
        </Container>
    );
};

export default Donadores;
