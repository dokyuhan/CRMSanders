import React, { useEffect, useState } from 'react';
import { dataProvider } from '../dataProvider';
import { Card, CardContent, CardHeader, ListItemText, Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Company {
    id: number;
    company: string;
    email: string;
    number: string;
}

export default function Companies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [newCompany, setNewCompany] = useState({ company: '', email: '', number: '' });
    const [editCompany, setEditCompany] = useState<Company | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const response = await dataProvider.getList('companies', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'id', order: 'ASC' },
                });

                setCompanies(response.data.data);
                setTotalCount(response.total);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setError("Error al obtener las compañías.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleCreateCompany = async () => {
        try {
            const response = await dataProvider.create('companies', {
                data: newCompany,
            });

            setCompanies(prev => [...prev, response.data]);
            setTotalCount(prev => prev + 1);
            setNewCompany({ company: '', email: '', number: '' });
        } catch (err) {
            console.error("Error creating company:", err);
            setError("Error al crear la compañía.");
        }
    };

    const handleEditCompany = (company: Company) => {
        setEditCompany(company);
        setOpenEditDialog(true);
    };

    const handleUpdateCompany = async () => {
        if (editCompany) {
            try {
                const response = await dataProvider.update('companies', {
                    id: editCompany.id,
                    data: { ...editCompany },
                });

                const updatedCompany = response.data; // Obtener la compañía actualizada

                // Actualiza el estado con la compañía actualizada
                setCompanies(prev => prev.map(c => (c.id === updatedCompany.id ? updatedCompany : c)));
                setOpenEditDialog(false);
                setEditCompany(null);
            } catch (err) {
                console.error("Error updating company:", err);
                setError("Error al actualizar la compañía.");
            }
        }
    };

    const handleDeleteCompany = async (id: number) => {
        try {
            await dataProvider.delete('companies', { id });

            setCompanies(prev => prev.filter(c => c.id !== id));
            setTotalCount(prev => prev - 1);
        } catch (err) {
            console.error("Error deleting company:", err);
            setError("Error al eliminar la compañía.");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="relative bg-gray-800 min-h-screen p-6 rounded-lg">
            <h1 className="text-4xl font-bold text-white mb-8">Compañías</h1>
            {totalCount > 0 && (
                <div className="absolute top-0 right-0 text-white text-lg mt-4 mr-4">
                    Total de compañías: {totalCount}
                </div>
            )}

            <Box component="form" sx={{ mb: 4 }} noValidate autoComplete="off">
                <TextField
                    label="Nombre de la Compañía"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newCompany.company}
                    onChange={(e) => setNewCompany({ ...newCompany, company: e.target.value })}
                    InputProps={{
                        style: { backgroundColor: 'white', color: 'black' }, // Cambiar color de fondo y texto
                    }}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    InputProps={{
                        style: { backgroundColor: 'white', color: 'black' }, // Cambiar color de fondo y texto
                    }}
                />
                <TextField
                    label="Número"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newCompany.number}
                    onChange={(e) => setNewCompany({ ...newCompany, number: e.target.value })}
                    InputProps={{
                        style: { backgroundColor: 'white', color: 'black' }, // Cambiar color de fondo y texto
                    }}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleCreateCompany}
                    style={{ marginTop: '16px' }} 
                >
                    Crear Compañía
                </Button>
            </Box>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map(company => (
                    <Card key={company.id} className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <CardHeader title={company.company} className="bg-gray-100 text-gray-800" />
                        <CardContent>
                            <ListItemText primary={`Email: ${company.email}`} secondary={`Número: ${company.number}`} />
                        </CardContent>
                        <Button onClick={() => handleEditCompany(company)}>
                            <EditIcon /> Editar
                        </Button>
                        <Button onClick={() => handleDeleteCompany(company.id)}>
                            <DeleteIcon /> Borrar
                        </Button>
                    </Card>
                ))}
            </div>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Editar Compañía</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nombre de la Compañía"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editCompany?.company || ''}
                        onChange={(e) => setEditCompany({ ...editCompany, company: e.target.value })}
                        InputProps={{
                            style: { backgroundColor: 'white', color: 'black' }, // Cambiar color de fondo y texto
                        }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editCompany?.email || ''}
                        onChange={(e) => setEditCompany({ ...editCompany, email: e.target.value })}
                        InputProps={{
                            style: { backgroundColor: 'white', color: 'black' }, // Cambiar color de fondo y texto
                        }}
                    />
                    <TextField
                        label="Número"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editCompany?.number || ''}
                        onChange={(e) => setEditCompany({ ...editCompany, number: e.target.value })}
                        InputProps={{
                            style: { backgroundColor: 'white', color: 'black' }, // Cambiar color de fondo y texto
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleUpdateCompany} color="primary">
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
