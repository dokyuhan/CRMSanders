"use strict";

import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cors from "cors";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection pool
/*async function connectToDB() {
  return await mysql.createConnection({
    host: "localhost",
    user: "user1",
    password: "cisco",
    database: "crmSanders",
  });
}*/

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user1', 
    password: process.env.DB_PASSWORD || 'cisco', 
    database: process.env.DB_DATABASE || 'crmSanders', 
});

app.post("/register", async (req, res) => {
    const { username: nombre, password: contrasena, email: correo } = req.body;
    const tipo_usuario = 'donador'; 
    console.log("Datos recibidos:", req.body);
    
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
        if (rows.length > 0) {
            console.log("El usuario ya existe")
            return res.status(400).json({ msg: 'El usuario ya existe' });
            
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);
        const hashedcorreo = await bcrypt.hash(correo, salt);

        await pool.query(
            'CALL registrar_usuario(?, ?, ?, ?)',
            [nombre, hashedPassword, hashedcorreo, tipo_usuario]
        );

        res.status(201).json({ msg: 'Usuario registrado exitosamente como donador' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

app.post("/login", async (req, res) => {
    const { email: correo, password: contrasena } = req.body;
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedCorreo = await bcrypt.hash(correo, salt);

        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [hashedCorreo]);
        
        if (rows.length === 0) {
            return res.status(400).json({ msg: 'Usuario no encontrado' });
        }

        const user = rows[0];
        
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (isMatch) {
            res.status(200).json({ msg: 'Inicio de sesión exitoso' });
        } else {
            res.status(400).json({ msg: 'Contraseña incorrecta' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
