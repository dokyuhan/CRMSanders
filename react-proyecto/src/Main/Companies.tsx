import React, { useEffect, useState } from 'react';
import { dataProvider } from '../dataProvider';
import { Card, CardContent, CardHeader, ListItemText } from '@mui/material';

export default function Companies() {
    interface Company {
        id: number;
        company: string;
        email: string;
        number: string;
    }

    const [companies, setCompanies] = useState<Company[]>([]);
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
        <div className="relative bg-gray-800 min-h-screen p-6 rounded-lg p-6">
            <h1 className="text-4xl font-bold text-white mb-8">Compañías</h1>
            {totalCount > 0 && (
                <div className="absolute top-0 right-0 text-white text-lg mt-4 mr-4">
                    Total de compañías: {totalCount}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map(company => (
                    <Card key={company.id} className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <CardHeader title={company.company} className="bg-gray-100 text-gray-800" />
                        <CardContent>
                            <ListItemText primary={`Email: ${company.email}`} secondary={`Número: ${company.number}`} />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
