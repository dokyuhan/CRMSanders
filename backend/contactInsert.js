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

const contactos = [
    { nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@gmail.com', telefono: '1234567890', direccion: 'Calle Falsa 123' },
    { nombre: 'Ana', apellido: 'García', email: 'ana.garcia@gmail.com', telefono: '0987654321', direccion: 'Av. Principal 456' },
    { nombre: 'Luis', apellido: 'Martínez', email: 'luis.martinez@gmail.com', telefono: '1122334455', direccion: 'Plaza Mayor 789' },
    { nombre: 'María', apellido: 'Rodríguez', email: 'maria.rodriguez@gmail.com', telefono: '6677889900', direccion: 'Calle Real 321' },
    { nombre: 'Carlos', apellido: 'Sánchez', email: 'carlos.sanchez@gmail.com', telefono: '4433221100', direccion: 'Av. Siempre Viva 100' },
];

async function insertarContactos() {
    try {
        for (let contacto of contactos) {
            await pool.query(
                'INSERT INTO contactos (nombre, apellido, email, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
                [contacto.nombre, contacto.apellido, contacto.email, contacto.telefono, contacto.direccion]
            );
        }
        console.log('Contactos insertados exitosamente');
    } catch (err) {
        console.error('Error al insertar contactos:', err.message);
    } finally {
        await pool.end();
    }
}

insertarContactos();
