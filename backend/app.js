"use strict";

import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cors from "cors";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
//require('dotenv').config();
import authenticateJWT from './token.js';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE, 
});

async function createAdminUsers() {
    const admins = [
        {
            nombre: 'admin1',
            contrasena: 'admin1',
            correo: 'admin1@gmail.com',
            tipo_usuario: 'admin'
        },
        {
            nombre: 'admin2',
            contrasena: 'admin2',
            correo: 'admin2@gmail.com',
            tipo_usuario: 'admin'
        }
    ];

    for (const admin of admins) {
        try {
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ? OR nombre = ?', [admin.correo, admin.nombre]);

            if (rows.length === 0) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(admin.contrasena, salt);
                const hashedCorreo = await bcrypt.hash(admin.correo, salt);

                await pool.query(
                    'CALL registrar_usuario(?, ?, ?, ?)',
                    [admin.nombre, hashedPassword, hashedCorreo, admin.tipo_usuario]
                );

                console.log(`Usuario ${admin.nombre} registrado correctamente.`);
            } else {
                console.log(`Usuario ${admin.nombre} o el correo ya existen.`);
            }
        } catch (err) {
            console.error(`Error creando usuario ${admin.nombre}:`, err.message);
        }
    }
}

app.post("/register", async (req, res) => {
    const { username: nombre, password: contrasena, email: correo } = req.body;
    const tipo_usuario = 'donador'; 
    console.log("Datos recibidos en /register:", req.body);
    
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [correo]);
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
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [correo]);
        console.log("Usuarios encontrados con el correo dado:", rows);

        if (rows.length === 0) {
            return res.status(400).json({ msg: 'Usuario no encontrado' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        console.log("Contraseña correcta:", isMatch);

        if (isMatch) {
            // Creacion del token del usuario
            const token = jwt.sign(
                { userId: user.id, role: user.tipo_usuario }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' } // Token expira en 1 hora
            );

            console.log("Token generado:", token);
            console.log("tipo_usuario:", user.tipo_usuario);
            //res.json({ tipo_usuario: user.tipo_usuario, token });
            res.status(200).json({ token, tipo_usuario: user.tipo_usuario, username: user.nombre });
        } else {
            res.status(400).json({ msg: 'Contraseña incorrecta' });
        }
    } catch (err) {
        console.error("Error en /login:", err.message);
        res.status(500).send('Error del servidor');
    }
});

app.get("/donations", authenticateJWT, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM donaciones');
        
        const [countResult] = await pool.query('SELECT COUNT(*) as count FROM donaciones');
        const totalCount = countResult[0].count;
        
        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        
        //res.json(rows);
        res.json({ data: rows, total: totalCount });
    } catch (err) {
        console.error("Error in /donations GET route:", err);
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});


// Crear una nueva donación
app.post("/donations", authenticateJWT, async (req, res) => {
    const { usuario_id, monto, metodo_pago } = req.body;
    
    try {
        const [result] = await pool.query(
            'INSERT INTO donaciones (usuario_id, monto, metodo_pago) VALUES (?, ?, ?)',
            [usuario_id, monto, metodo_pago]
        );

        res.status(201).json({ id: result.insertId, usuario_id, monto, metodo_pago, fecha_donacion: new Date() });
    } catch (err) {
        console.error("Error in /donations POST route:", err);
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

app.put("/donations/:id", async (req, res) => {
    const { id } = req.params;
    const { usuario_id, monto, metodo_pago } = req.body;

    if (!usuario_id || !monto || !metodo_pago) {
        return res.status(400).json({ msg: 'All fields are required for update' });
    }

    try {
        await pool.query(
            'UPDATE donaciones SET usuario_id = ?, monto = ?, metodo_pago = ? WHERE id = ?',
            [usuario_id, monto, metodo_pago, id]
        );

        res.status(200).json({ id, usuario_id, monto, metodo_pago });
    } catch (err) {
        console.error("Error in /donations PUT route:", err);
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

app.delete("/donations/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: 'Donation ID is required' });
    }

    try {
        await pool.query('DELETE FROM donaciones WHERE id = ?', [id]);
        res.status(200).json({ msg: 'Donación eliminada' });
    } catch (err) {
        console.error("Error in /donations DELETE route:", err);
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Endpoint para mostrar estadísticas de donaciones
app.get("/donaciones", async (req, res) => {
    try {
        const [donationsByMethod] = await pool.query(`
            SELECT metodo_pago, SUM(monto) as total
            FROM donaciones
            GROUP BY metodo_pago
        `);

        const [donationsPerDay] = await pool.query(`
            SELECT DATE(fecha_donacion) as fecha, COUNT(*) as count
            FROM donaciones
            GROUP BY fecha
            ORDER BY fecha
        `);

        const [cumulativeDonations] = await pool.query(`
            SELECT DATE(fecha_donacion) as fecha, SUM(monto) as daily_total
            FROM donaciones
            GROUP BY fecha
            ORDER BY fecha
        `);

        let cumulativeSum = 0;
        const cumulativeData = cumulativeDonations.map(row => {
            cumulativeSum += parseFloat(row.daily_total);
            return { fecha: row.fecha, acumulado: cumulativeSum };
        });

        res.json({
            donationsByMethod,
            donationsPerDay,
            cumulativeData
        });
    } catch (err) {
        console.error("Error en /donaciones-estadisticas:", err.message);
        res.status(500).send('Error del servidor');
    }
});




app.post("/donate", async (req, res) => {
    const { usuario_id, monto, metodo_pago } = req.body;
    
    try {
        if (!usuario_id || !monto || !metodo_pago) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        const [result] = await pool.query(
            'INSERT INTO donaciones (usuario_id, monto, metodo_pago) VALUES (?, ?, ?)',
            [usuario_id, monto, metodo_pago]
        );

        res.status(201).json({ 
            id: result.insertId, 
            usuario_id, 
            monto, 
            metodo_pago, 
            fecha_donacion: new Date() 
        });
    } catch (err) {
        console.error("Error in /donations DELETE route:", err);
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Endpoint para mostrar estadísticas de donaciones
app.get("/donaciones", async (req, res) => {
    try {
        const [donationsByMethod] = await pool.query(`
            SELECT metodo_pago, SUM(monto) as total
            FROM donaciones
            GROUP BY metodo_pago
        `);

        const [donationsPerDay] = await pool.query(`
            SELECT DATE(fecha_donacion) as fecha, COUNT(*) as count
            FROM donaciones
            GROUP BY fecha
            ORDER BY fecha
        `);

        const [cumulativeDonations] = await pool.query(`
            SELECT DATE(fecha_donacion) as fecha, SUM(monto) as daily_total
            FROM donaciones
            GROUP BY fecha
            ORDER BY fecha
        `);

        let cumulativeSum = 0;
        const cumulativeData = cumulativeDonations.map(row => {
            cumulativeSum += parseFloat(row.daily_total);
            return { fecha: row.fecha, acumulado: cumulativeSum };
        });

        res.json({
            donationsByMethod,
            donationsPerDay,
            cumulativeData
        });
    } catch (err) {
        console.error("Error en /donaciones-estadisticas:", err.message);
        res.status(500).send('Error del servidor');
    }
});




app.post("/donate", async (req, res) => {
    const { usuario_id, monto, metodo_pago } = req.body;
    
    try {
        if (!usuario_id || !monto || !metodo_pago) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        const [result] = await pool.query(
            'INSERT INTO donaciones (usuario_id, monto, metodo_pago) VALUES (?, ?, ?)',
            [usuario_id, monto, metodo_pago]
        );

        res.status(201).json({ 
            id: result.insertId, 
            usuario_id, 
            monto, 
            metodo_pago, 
            fecha_donacion: new Date() 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

app.get("/contacts", async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contactos');
        console.log(rows)
        res.json({ data: rows });
    } catch (err) {
        console.error("Error en /contacts GET route:", err.message);
        res.status(500).send('Error del servidor');
    }
});


app.get("/contacts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM contactos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Contacto no encontrado' });
        }
        res.json({ data: rows[0] });
    } catch (err) {
        console.error("Error en /contacts/:id GET route:", err.message);
        res.status(500).send('Error del servidor');
    }
});


app.post("/contacts", async (req, res) => {
    console.log("petición aceptada")
    const { nombre, telefono, correo, direccion } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO contactos (nombre, telefono, correo, direccion) VALUES (?, ?, ?, ?)',
            [nombre, telefono, correo, direccion]
        );
        res.status(201).json({ id: result.insertId, nombre, telefono, correo, direccion });
    } catch (err) {
        console.error("Error en /contacts POST route:", err.message);
        res.status(500).send('Error del servidor');
    }
});


app.put("/contacts/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, correo, direccion } = req.body;

    try {
        await pool.query(
            'UPDATE contactos SET nombre = ?, telefono = ?, correo = ?, direccion = ? WHERE id = ?',
            [nombre, telefono, correo, direccion, id]
        );
        res.status(200).json({ id, nombre, telefono, correo, direccion });
    } catch (err) {
        console.error("Error en /contacts/:id PUT route:", err.message);
        res.status(500).send('Error del servidor');
    }
});

app.delete("/contacts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM contactos WHERE id = ?', [id]);
        res.status(200).json({ msg: 'Contacto eliminado' });
    } catch (err) {
        console.error("Error en /contacts/:id DELETE route:", err.message);
        res.status(500).send('Error del servidor');
    }
});


app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    await createAdminUsers();
});
