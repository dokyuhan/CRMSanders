import React, { useEffect, useState } from 'react';
import { dataProvider } from '../dataProvider';
import { Card, CardContent, CardHeader, ListItemText } from '@mui/material';

export default function Companies() {
    const [companies, setCompanies] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="relative">
            {/* Título de Compañías en color banco y más grande */}
            <h1 className="text-4xl font-bold text-white mb-4">Compañías</h1>

            {/* Si totalCount es mayor que 0, muestra el número en la esquina superior derecha */}
            {totalCount > 0 && (
                <div className="absolute top-0 right-0 text-white text-lg mt-4 mr-4">
                    Total de compañías: {totalCount}
                </div>
            )}

            <div className="flex flex-wrap gap-4">
                {companies.map(company => (
                    <div key={company.id} className="flex-1 max-w-xs">
                        <Card className="shadow-lg">
                            <CardHeader title={company.company} className="bg-gray-100" />
                            <CardContent>
                                <ListItemText primary={`Email: ${company.email}`} secondary={`Número: ${company.number}`} />
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
