import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { dataProvider } from '../dataProvider';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Donadores: React.FC = () => {
    const [datos, setDatos] = useState({
        usuarioData: null,
        fechaData: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleSearch = async () => {
        if (!search.trim()) {
            alert('Por favor ingrese un ID de usuario válido.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await dataProvider.getList('donacionesdonadores', {
                filter: { usuario_id: search },
            });
            setDatos({
                usuarioData: response.data.usuarioData,
                fechaData: response.data.fechaData.map(d => ({
                    fecha: format(new Date(d.fecha), 'yyyy-MM-dd'), // Formatea la fecha sin tiempo
                    total: parseFloat(d.total_donado_por_fecha)
                }))
            });
            console.log(response.data.usuarioData);
        } catch (err) {
            console.error('Error fetching donaciones:', err);
            setError('Error al cargar las donaciones');
        }
        setLoading(false);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container className="bg-gray-800 text-white p-4 rounded-lg p-6">
            <Typography variant="h4" sx={{ color: 'white' }}>Estadísticas del Donador</Typography>
            <TextField
                fullWidth
                label="Buscar Usuario por ID"
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
                    backgroundColor: '#207CCD', // Establece el color de fondo principal
                    '&:hover': {
                        backgroundColor: '#1b6cab' // Cambia el color de fondo en el hover a un tono más oscuro
                    }
                }}
            >
                Buscar
            </Button>
            {datos.usuarioData && (
                <>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={datos.fechaData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip 
                                contentStyle={{ color: '#000', backgroundColor: '#fff' }} // Estilos personalizados para Tooltip
                            />
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
