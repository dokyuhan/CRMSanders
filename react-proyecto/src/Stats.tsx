import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { dataProvider } from './dataProvider';


export const Stats = () => {
    const [data, setData] = useState({
        donationsByMethod: [],
        donationsPerDay: [],
        cumulativeData: [],
    });

    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Usa dataProvider para hacer la solicitud
                const { data: responseData } = await dataProvider.getList('donaciones', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'id', order: 'DESC' },
                    filter: {}
                });

                setData(responseData);
            } catch (err) {
                console.error('Error fetching statistics:', err);
                setError('Error al obtener las estadísticas');
            }
        };

        fetchData();
    }, []);

    return (
        <Card>
            <CardHeader title="Statistics" />
            <CardContent>
                <List>
                    <ListItem>
                        <ListItemText primary="Total Users" secondary="1,250" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Active Projects" secondary="300" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Revenue" secondary="$1,200,000" />
                    </ListItem>
                </List>

                {/* Donations by Payment Method */}
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.donationsByMethod}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metodo_pago" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>

                {/* Number of Donations per Day */}
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.donationsPerDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>

                {/* Cumulative Donations Over Time */}
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.cumulativeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="acumulado" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
