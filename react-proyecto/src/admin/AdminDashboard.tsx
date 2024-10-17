import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dataProvider } from '../dataProvider';
import { Typography } from '@mui/material'; // Import Typography from Material-UI

export default function AdminDashboard() {
    const [recentContacts, setRecentContacts] = useState([]);
    const [userStats, setUserStats] = useState([]);
    const [recentDonations, setRecentDonations] = useState([]);
    const [latestCompanies, setLatestCompanies] = useState([]);
    const [donationsByMethod, setDonationsByMethod] = useState([]); 
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

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

        const fetchDonationsByMethod = async () => {
            try {
                const response = await dataProvider.getList('stats', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'id', order: 'DESC' },
                    filter: {}
                });

                // Convertir total a número
                const donationsByMethodData = response.data.donationsByMethod.map(item => ({
                    ...item,
                    total: parseFloat(item.total) // Asegúrate de que sea un número
                }));

                setDonationsByMethod(donationsByMethodData); // Guardar en estado
            } catch (error) {
                console.error("Error fetching donations by method:", error);
            }
        };

        fetchRecentContacts();
        fetchUserStats();
        fetchRecentDonations();
        fetchLatestCompanies();
        fetchDonationsByMethod(); 
    }, []);

    return (
        <div className="bg-gray-800 text-white p-5 rounded-lg p-6">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl">Panel de Control</h1>
                <div className="text-sm"> {/* Hacer el tamaño de texto más pequeño */}
                    <h2 className="font-bold">Usuarios registrados</h2>
                    <ul>
                        {userStats.map(stat => (
                            <li key={stat.tipo_usuario}>
                                <Typography variant="body1">
                                    {stat.tipo_usuario}: {stat.cantidad}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mb-5 flex justify-between"> {/* Flex para acomodar las últimas donaciones y el gráfico */}
                <div className="p-4 bg-gray-700 rounded-lg w-2/3"> {/* Espacio para últimas donaciones */}
                    <h2 className="text-2xl mb-3">Últimas Donaciones</h2>
                    {recentDonations.map(donation => (
                        <p key={donation.donacion_id}>
                            <strong>{donation.usuario_nombre}</strong> donó {donation.donacion_monto} el {new Date(donation.donacion_fecha).toLocaleDateString()}
                        </p>
                    ))}
                </div>
                <div className="w-1/3 p-4 bg-gray-700 rounded-lg ml-4"> {/* Espacio para el gráfico */}
                    <h2 className="text-xl mt-5 mb-2 text-center">Donaciones por Método de Pago</h2>
                    <div className="h-48"> {/* Ajustar la altura del gráfico */}
                        <ResponsiveContainer width="100%" height="100%">
                            {donationsByMethod.length > 0 ? (
                                <PieChart>
                                    <Pie
                                        data={donationsByMethod}
                                        dataKey="total"
                                        nameKey="metodo_pago"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={40} // Hacer el gráfico más pequeño
                                        fill="#8884d8"
                                        label
                                    >
                                        {donationsByMethod.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', color: '#fff' }} />
                                    <Legend wrapperStyle={{ color: '#fff' }} />
                                </PieChart>
                            ) : (
                                <p className="text-center text-white">No hay datos disponibles para el gráfico de pastel.</p>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="mb-5 p-4 bg-gray-700 rounded-lg">
                <h2 className="text-2xl mb-3">Contactos Recientes</h2>
                {recentContacts.map(contact => (
                    <p key={contact.id}>
                        <strong>{contact.nombre}</strong> - {contact.email}
                    </p>
                ))}
            </div>
            <div className="mb-5 p-4 bg-gray-700 rounded-lg">
                <h2 className="text-2xl mb-3">Empresas Principales</h2>
                {latestCompanies.map(company => (
                    <p key={company.id}>
                        <strong>{company.company}</strong> - {company.email}
                    </p>
                ))}
            </div>
        </div>
    );
}
