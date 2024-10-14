import React, { useEffect, useState } from 'react';
import { dataProvider } from '../dataProvider';

export default function ColabDashboard() {
    const [recentContacts, setRecentContacts] = useState([]);
    const [userStats, setUserStats] = useState([]);
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
        fetchLatestCompanies();
    }, []);

    return (
        <div className="bg-gray-800 text-white p-5 rounded-lg p-6">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl">Panel de Control</h1>
                <div className="text-sm">
                    <h2 className="font-bold">Usuarios registrados</h2>
                    {userStats.map(stat => (
                        <p key={stat.tipo_usuario}>
                            {stat.tipo_usuario}: {stat.cantidad}
                        </p>
                    ))}
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
