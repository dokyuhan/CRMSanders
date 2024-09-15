"use strict";

import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cors from "cors";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection pool
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
    console.log("Datos recibidos en /register:", req.body);
    
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
        console.log("Usuarios encontrados con el nombre dado:", rows);
        
        if (rows.length > 0) {
            console.log("El usuario ya existe");
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
        console.error("Error en /register:", err.message);
        res.status(500).send('Error del servidor');
    }
});

app.post("/login", async (req, res) => {
    const { email: correo, password: contrasena } = req.body;
    console.log("Datos recibidos en /login:", req.body);
    
    try {
        // Buscar al usuario por el correo (sin hash)
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [correo]);
        console.log("Usuarios encontrados con el correo dado:", rows);
        
        if (rows.length === 0) {
            return res.status(400).json({ msg: 'Usuario no encontrado' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (isMatch) {
            // Devolver el tipo de usuario si la autenticación es exitosa
            res.status(200).json({ msg: 'Inicio de sesión exitoso', tipo_usuario: user.tipo_usuario });
        } else {
            res.status(400).json({ msg: 'Contraseña incorrecta' });
        }
    } catch (err) {
        console.error("Error en /login:", err.message);
        res.status(500).send('Error del servidor');
    }
});

app.get("/donations", async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM donaciones');
        
        const [countResult] = await pool.query('SELECT COUNT(*) as count FROM donaciones');
        const totalCount = countResult[0].count;

        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});


// Crear una nueva donación
app.post("/donations", async (req, res) => {
    const { usuario_id, monto, metodo_pago } = req.body;
    
    try {
        const [result] = await pool.query(
            'INSERT INTO donaciones (usuario_id, monto, metodo_pago) VALUES (?, ?, ?)',
            [usuario_id, monto, metodo_pago]
        );

        res.status(201).json({ id: result.insertId, usuario_id, monto, metodo_pago, fecha_donacion: new Date() });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Actualizar una donación
app.put("/donations/:id", async (req, res) => {
    const { id } = req.params;
    const { usuario_id, monto, metodo_pago } = req.body;

    try {
        await pool.query(
            'UPDATE donaciones SET usuario_id = ?, monto = ?, metodo_pago = ? WHERE id = ?',
            [usuario_id, monto, metodo_pago, id]
        );

        res.status(200).json({ id, usuario_id, monto, metodo_pago });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Eliminar una donación
app.delete("/donations/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM donaciones WHERE id = ?', [id]);
        res.status(200).json({ msg: 'Donación eliminada' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
