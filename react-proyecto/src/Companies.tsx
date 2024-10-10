import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";
import { dataProvider } from './dataProvider'; 

export const Companies = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        dataProvider.getList('companies', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
        })
        .then(response => {
            console.log("Data received:", response);  // Puedes verificar la respuesta completa aquí
            setCompanies(response.data);  // Cambia esto para acceder a la propiedad data
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
        });
    }, []);

    return (
        <Card>
            <CardHeader title="Lista de Empresas" />
            <CardContent>
                <List>
                    {companies.map((company) => (
                        <ListItem key={company.id}>
                            <ListItemText 
                                primary={company.company} 
                                secondary={company.email} 
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};
