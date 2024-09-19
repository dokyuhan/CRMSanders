"use strict";

import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import 'dotenv/config';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const usuarios = [
    { nombre: 'Usuario1', contrasena: '1234', correo: 'usuario1@mail.com', tipo_usuario: 'donador' },
    { nombre: 'Usuario2', contrasena: '1234', correo: 'usuario2@mail.com', tipo_usuario: 'donador' },
    { nombre: 'Usuario3', contrasena: '1234', correo: 'usuario3@mail.com', tipo_usuario: 'donador' },
    { nombre: 'Usuario4', contrasena: '1234', correo: 'usuario4@mail.com', tipo_usuario: 'donador' },
    { nombre: 'Usuario5', contrasena: '1234', correo: 'usuario5@mail.com', tipo_usuario: 'donador' },
    { nombre: 'Usuario6', contrasena: '1234', correo: 'usuario6@mail.com', tipo_usuario: 'donador' },
    { nombre: 'Usuario7', contrasena: '1234', correo: 'usuario7@mail.com', tipo_usuario: 'donador' },
    { nombre: 'Usuario8', contrasena: '1234', correo: 'usuario8@mail.com', tipo_usuario: 'donador' },
    { nombre: 'Usuario9', contrasena: '1234', correo: 'usuario9@mail.com', tipo_usuario: 'donador' },
    { nombre: 'Usuario10', contrasena: '1234', correo: 'usuario10@mail.com', tipo_usuario: 'donador' },
];

async function insertarUsuarios() {
    try {
        for (let usuario of usuarios) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(usuario.contrasena, salt);
            const hashedEmail = await bcrypt.hash(usuario.correo, salt);

            await pool.query(
                'CALL registrar_usuario(?, ?, ?, ?)',
                [usuario.nombre, hashedPassword, hashedEmail, usuario.tipo_usuario]
            );
        }
        console.log('Usuarios insertados exitosamente');
    } catch (err) {
        console.error('Error al insertar usuarios:', err.message);
    } finally {
        await pool.end();
    }
}

insertarUsuarios();
