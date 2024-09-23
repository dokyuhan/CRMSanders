"use strict";

import mysql from "mysql2/promise";
import 'dotenv/config';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user1',
    password: process.env.DB_PASSWORD || 'cisco',
    database: process.env.DB_DATABASE || 'crmSanders',
});

const donaciones = [
    { usuario_id: 2, monto: 100.00, metodo_pago: 'PayPal', fecha_donacion: '2024-09-02 14:45:00' },
    { usuario_id: 3, monto: 25.75, metodo_pago: 'Transferencia Bancaria', fecha_donacion: '2024-09-02 14:45:00' },
    { usuario_id: 4, monto: 200.00, metodo_pago: 'Tarjeta de Débito', fecha_donacion: '2024-09-02 14:45:00' },
    { usuario_id: 5, monto: 75.50, metodo_pago: 'Tarjeta de Crédito', fecha_donacion: '2024-09-05 11:20:00' },
    { usuario_id: 6, monto: 30.00, metodo_pago: 'Efectivo', fecha_donacion: '2024-09-06 13:10:00' },
    { usuario_id: 7, monto: 120.00, metodo_pago: 'PayPal', fecha_donacion: '2024-09-07 17:45:00' },
    { usuario_id: 8, monto: 60.00, metodo_pago: 'Transferencia Bancaria', fecha_donacion: '2024-09-08 10:05:00' },
    { usuario_id: 9, monto: 90.25, metodo_pago: 'Tarjeta de Débito', fecha_donacion: '2024-09-09 12:50:00' },
    { usuario_id: 10, monto: 150.00, metodo_pago: 'Tarjeta de Crédito', fecha_donacion: '2024-09-10 15:30:00' },
    { usuario_id: 11, monto: 50.00, metodo_pago: 'Tarjeta de Crédito', fecha_donacion: '2024-09-01 10:30:00' },
];

async function insertarDonaciones() {
    try {
        for (let donacion of donaciones) {
            await pool.query(
                'INSERT INTO donaciones (usuario_id, monto, metodo_pago, fecha_donacion) VALUES (?, ?, ?, ?)',
                [donacion.usuario_id, donacion.monto, donacion.metodo_pago, donacion.fecha_donacion]
            );
        }
        console.log('Donaciones insertadas exitosamente');
    } catch (err) {
        console.error('Error al insertar donaciones:', err.message);
    } finally {
        await pool.end();
    }
}

insertarDonaciones();
