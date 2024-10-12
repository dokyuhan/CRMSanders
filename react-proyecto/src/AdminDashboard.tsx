import React, { useEffect, useState } from 'react';
import { dataProvider } from './dataProvider';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function AdminDashboard() {
    const [recentContacts, setRecentContacts] = useState([]);
    const [userStats, setUserStats] = useState([]);
    const [recentDonations, setRecentDonations] = useState([]);
    const [latestCompanies, setLatestCompanies] = useState([]);

    useEffect(() => {
        const fetchRecentContacts = async () => {
            try {
                const response = await dataProvider.getList('recentContacts', {
                    pagination: { page: 1, perPage: 5 },
                    sort: { field: 'fecha_creacion', order: 'DESC' },
                });
                setRecentContacts(response.data.data);
            } catch (error) {
                console.error("Error fetching recent contacts:", error);
            }
        };

        const fetchUserStats = async () => {
            try {
                const response = await dataProvider.getList('userStats', {
                    pagination: { page: 1, perPage: 100 },
                });
                setUserStats(response.data.data);
            } catch (error) {
                console.error("Error fetching user stats:", error);
            }
        };

        const fetchRecentDonations = async () => {
            try {
                const response = await dataProvider.getList('recentDonations', {
                    pagination: { page: 1, perPage: 5 },
                    sort: { field: 'donacion_fecha', order: 'DESC' },
                });
                setRecentDonations(response.data.data);
            } catch (error) {
                console.error("Error fetching recent donations:", error);
            }
        };

        const fetchLatestCompanies = async () => {
            try {
                const response = await dataProvider.getList('latestCompanies', {
                    pagination: { page: 1, perPage: 100 },
                });
                setLatestCompanies(response.data.data);
            } catch (error) {
                console.error("Error fetching latest companies:", error);
            }
        };

        fetchRecentContacts();
        fetchUserStats();
        fetchRecentDonations();
        fetchLatestCompanies();
    }, []);

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Recent Contacts</Typography>
                            <ul>
                                {recentContacts.map(contact => (
                                    <li key={contact.id}>
                                        <Typography variant="body1">{contact.nombre} {contact.apellido}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">User Stats</Typography>
                            <ul>
                                {userStats.map(stat => (
                                    <li key={stat.tipo_usuario}>
                                        <Typography variant="body1">{stat.tipo_usuario}: {stat.cantidad}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Latest Donations</Typography>
                            <ul>
                                {recentDonations.map(donation => (
                                    <li key={donation.donacion_id}>
                                        <Typography variant="body1">
                                            {donation.usuario_nombre} donó {donation.donacion_monto} usando {donation.donacion_metodo_pago} el {new Date(donation.donacion_fecha).toLocaleDateString()}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Main Companies</Typography>
                            <ul>
                                {latestCompanies.map(company => (
                                    <li key={company.id}>
                                        <Typography variant="body1">{company.company} - {company.email}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
