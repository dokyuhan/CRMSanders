import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { dataProvider } from '../dataProvider';
import { TextField, Button, CircularProgress } from '@mui/material';

interface Company {
    id: number;
    company: string;
    email: string;
    number: string;
}

export default function EditCompany() {
    const { id } = useParams<{ id: string }>(); 
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<Company | null>(null);
    const { control, handleSubmit, setValue } = useForm<Company>();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setLoading(true);
                const response = await dataProvider.getOne('companies', { id: parseInt(id || '', 10) });
                setCompany(response.data);
                setValue('company', response.data.company);
                setValue('email', response.data.email);
                setValue('number', response.data.number);
            } catch (error) {
                console.error("Error fetching company:", error);
                alert("Error al cargar los datos de la compañía.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id, setValue]);

    const onSubmit = async (data: Company) => {
        try {
            await dataProvider.update('companies', {
                id: parseInt(id || '', 10),
                data,
            });
            alert('Compañía actualizada exitosamente.');
            navigate('/companies');
        } catch (error) {
            console.error('Error updating company:', error);
            alert('Error al actualizar la compañía.');
        }
    };

    if (loading) return <div className="text-white"><CircularProgress /></div>;

    return (
        <div className="relative bg-gray-800 min-h-screen p-6 rounded-lg">
            <h1 className="text-4xl font-bold text-white mb-8">Editar Compañía</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    name="company"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} label="Nombre de la Compañía" fullWidth variant="outlined" />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} label="Email" fullWidth variant="outlined" />
                    )}
                />
                <Controller
                    name="number"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} label="Número de Teléfono" fullWidth variant="outlined" />
                    )}
                />
                <Button type="submit" variant="contained" color="primary">
                    Guardar Cambios
                </Button>
                <Button onClick={() => navigate('/companies')} variant="outlined" color="secondary">
                    Cancelar
                </Button>
            </form>
        </div>
    );
}
