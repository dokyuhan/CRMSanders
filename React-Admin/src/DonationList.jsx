import React from 'react';
import { List, Datagrid, TextField, NumberField, DateField, useListContext } from 'react-admin';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const DonationPieChart = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    console.log("DonationPieChart data:", data);

    return (
        <PieChart width={400} height={300}>
            <Pie
                data={data}
                cx={200}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="monto"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export const DonationList = () => (
    <List>
        <Datagrid rowClick="edit" >
            <TextField source='id' />
            <TextField source="usuario_id" />
            <NumberField source="monto" />
            <TextField source="metodo_de_pago" />
            <DateField source="fecha_de_donación" />
        </Datagrid>
        <DonationData />
    </List>
);

const DonationData = () => {
    const { data, isLoading, error } = useListContext();

    if (isLoading) {
        console.log("Loading data...");
        return <div>Loading...</div>;
    }
    if (error) {
        console.error("Error loading data:", error);
        return <div>Error loading data!</div>;
    }

    const chartData = Object.values(data).reduce((acc, curr) => {
        const found = acc.find(item => item.name === curr.metodo_pago);
        if (found) {
            found.monto += curr.monto;
        } else {
            acc.push({ name: curr.metodo_pago, monto: curr.monto });
        }
        return acc;
    }, []);

    console.log("chartData prepared:", chartData);  // Verificar la preparación de los datos
    return <DonationPieChart data={chartData} />;
};