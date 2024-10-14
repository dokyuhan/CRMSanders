import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { dataProvider } from '../dataProvider';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

export const Stats = () => {
    const [data, setData] = useState({
        donationsByMethod: [],
        donationsPerDay: [],
        cumulativeData: [],
        donationsCountByMethod: [],
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: responseData } = await dataProvider.getList('stats', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'id', order: 'DESC' },
                    filter: {}
                });

                const donationsByMethod = responseData.donationsByMethod.map(item => ({
                    ...item,
                    total: parseFloat(item.total)
                }));

                const donationsCountByMethod = responseData.donationsCountByMethod.map(item => ({
                    ...item,
                    total: parseFloat(item.total)
                }));

                const donationsPerDay = responseData.donationsPerDay.map(item => ({
                    ...item,
                    fecha: new Date(item.fecha).toLocaleDateString('en-CA')
                }));

                const cumulativeData = responseData.cumulativeData.map(item => ({
                    ...item,
                    fecha: new Date(item.fecha).toLocaleDateString('en-CA') 
                }));

                setData(prevData => ({
                    ...prevData,
                    donationsByMethod,
                    donationsCountByMethod,
                    donationsPerDay,
                    cumulativeData
                }));
            } catch (err) {
                console.error('Error fetching statistics:', err);
                setError('Error al obtener las estadísticas');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-3xl font-semibold mb-4 text-white">Estadísticas</h2>
            <div className="flex flex-col md:flex-row md:justify-between">
                {/* Gráfico de pastel con donationsByMethod (monto total por método) */}
                <div className="flex-1 h-72 mb-6 md:mb-0 md:mr-2">
                    <h3 className="text-lg text-center font-semibold mb-3 text-white">Donaciones por método de pago</h3>
                    <ResponsiveContainer width="100%" height="120%">
                        {data.donationsByMethod.length > 0 ? (
                            <PieChart>
                                <Pie
                                    data={data.donationsByMethod}
                                    dataKey="total"
                                    nameKey="metodo_pago"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    fill="#8884d8"
                                    label
                                >
                                    {data.donationsByMethod.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
                                <Legend wrapperStyle={{ color: '#fff' }} />
                            </PieChart>
                        ) : (
                            <p className="text-center text-white">No hay datos disponibles para el gráfico de pastel.</p>
                        )}
                    </ResponsiveContainer>
                </div>
                {/* Gráfico de pastel con donationsCountByMethod (número de donaciones por método) */}
                <div className="flex-1 h-72 md:ml-2">
                    <h3 className="text-lg text-center font-semibold mb-3 text-white">Cantidad de donaciones por método de pago</h3>
                    <ResponsiveContainer width="100%" height="120%">
                        {data.donationsCountByMethod.length > 0 ? (
                            <PieChart>
                                <Pie
                                    data={data.donationsCountByMethod}
                                    dataKey="total"
                                    nameKey="metodo_pago"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110} 
                                    fill="#8884d8"
                                    label
                                >
                                    {data.donationsCountByMethod.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
                                <Legend wrapperStyle={{ color: '#fff' }} />
                            </PieChart>
                        ) : (
                            <p className="text-center text-white">No hay datos disponibles para el gráfico de pastel.</p>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="my-40"></div>
            {/* Gráfico de línea para el número de donaciones por día */}
            <h3 className="text-lg text-center font-semibold mt-12 text-white">Número de donaciones por día</h3>
            <div className="h-72 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.donationsPerDay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="fecha" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
                        <Legend wrapperStyle={{ color: '#fff' }} />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de área para las donaciones acumuladas a lo largo del tiempo */}
            <h3 className="text-lg text-center font-semibold mb-3 text-white">Donaciones acumuladas a lo largo del tiempo</h3>
            <div className="h-72 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.cumulativeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="fecha" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
                        <Legend wrapperStyle={{ color: '#fff' }} />
                        <Area type="monotone" dataKey="acumulado" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};