import React, { useEffect, useState } from 'react';
import { dataProvider } from '../dataProvider';
import { Card, CardContent, CardHeader, List, ListItem, ListItemText, Typography } from '@mui/material';

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

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <div>
            <h1>Compañías</h1>
            <Typography variant="subtitle1">Total de compañías: {totalCount}</Typography>
            <List>
                {companies.map(company => (
                    <ListItem key={company.id}>
                        <Card>
                            <CardHeader title={company.company} />
                            <CardContent>
                                <ListItemText primary={`Email: ${company.email}`} secondary={`Número: ${company.number}`} />
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
