"use strict";

import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cors from "cors";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import https from 'https';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import authenticateJWT from './token.js';

const app = express();
const PORT = process.env.PORT || 3003;

//app.use(cors());
app.use(cors({
    origin: ['https://localhost:5173'],
    exposedHeaders: ['X-Total-Count'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

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

//---------------------------------Get endpoints---------------------------------
app.get("/donations", authenticateJWT, async (req, res) => {
    console.log("Accessing donations route with user:", req.user);
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

// Endpoint para mostrar estadísticas de donaciones
app.get("/stats", authenticateJWT, async (req, res) => {
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

        // Aquí se cuenta el total de donaciones o el total de resultados que desees
        const totalResults = donationsByMethod.length + donationsPerDay.length + cumulativeData.length;

        // Establecer el encabezado X-Total-Count
        res.setHeader('X-Total-Count', totalResults);
        
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


app.get('/contacts', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contactos');
        res.json({ data: rows });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
});


//---------------------------------Post endpoints---------------------------------
app.post("/register", async (req, res) => {
    console.log("Petición aceptada")
    const { username: nombre, password: contrasena, email: correo } = req.body;
    const tipo_usuario = 'colaborador'; 
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

        res.status(201).json({ msg: 'Usuario registrado exitosamente como colaborador' });
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

            res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'None', path: '/' });
            console.log("Token stored in HttpOnly cookie", token);

            res.status(200).json({ tipo_usuario: user.tipo_usuario, username: user.nombre });
        } else {
            res.status(400).json({ msg: 'Contraseña incorrecta' });
        }
    } catch (err) {
        console.error("Error en /login:", err.message);
        res.status(500).send('Error del servidor');
    }
});


app.post("/donate", authenticateJWT, async (req, res) => {
    const { donador_id, monto, metodo_pago } = req.body;
    
    try {
        if (!donador_id || !monto || !metodo_pago) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        const [donadorRows] = await pool.query('SELECT * FROM donadores WHERE id = ?', [donador_id]);

        if (donadorRows.length === 0) {
            return res.status(404).json({ msg: 'Donador no encontrado' });
        }

        const [result] = await pool.query(
            'INSERT INTO donaciones (donador_id, monto, metodo_pago) VALUES (?, ?, ?)',
            [donador_id, monto, metodo_pago]
        );

        res.status(201).json({ 
            id: result.insertId, 
            donador_id, 
            monto, 
            metodo_pago, 
            fecha_donacion: new Date() 
        });
    } catch (err) {
        console.error("Error in /donate POST route:", err.message);
        res.status(500).send('Error del servidor');
    }
});

app.post("/donations", authenticateJWT, async (req, res) => {
    console.log("Accessing donations route with user:", req.user);
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

app.post('/registerDonor', async (req, res) => {
    const { name, surname, email, password } = req.body;
    if (!name || !surname || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const [existingDonor] = await pool.query('SELECT * FROM donors WHERE email = ?', [email]);
        if (existingDonor.length > 0) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query('INSERT INTO donors (name, surname, email, password) VALUES (?, ?, ?, ?)', [name, surname, email, hashedPassword]);

        res.status(201).json({ id: result.insertId, name, surname, email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el donante.' });
    }
});

app.post('/loginDonor', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const [donor] = await pool.query('SELECT * FROM donors WHERE email = ?', [email]);
        console.log("Usuarios encontrados con el correo dado:", donor);
        
        if (donor.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isPasswordValid = await bcrypt.compare(password, donor[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const token = jwt.sign({ id: donor[0].id, email: donor[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
});






//Creacion de las constantes para las llaves de HTTPS
const privateKey = fs.readFileSync('../Cert/server.key', 'utf8');
const certificate = fs.readFileSync('../Cert/server.crt', 'utf8');
const ca = fs.readFileSync('../Cert/ca/ca.crt', 'utf8')

const credentials = { key: privateKey, cert: certificate, ca: ca};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, async () => {
    console.log(`HTTPS Server running on port ${PORT}`);
    try {
        await createAdminUsers();
    } catch (error) {
        console.error("Error creating admin users:", error);
    }
});
/*
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    await createAdminUsers();
});
*/