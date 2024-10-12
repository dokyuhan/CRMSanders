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
import { Session } from "inspector";
import { sendThankYouEmail } from './nodemailer.js';


const app = express();
const PORT = process.env.PORT || 3003;

// Configuraciones CORS
app.use(cors({
    origin: ['https://localhost:5173'],
    exposedHeaders: ['X-Total-Count'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Configuraciones para parseo de archivos JSON y uso de cookies
app.use(bodyParser.json());
app.use(cookieParser());

const pool = mysql.createPool({
    connectionLimit: process.env.CON_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE, 
});

// Creacion de usuarios administrador
async function createAdminUsers() {
    const admins = [
        {
            nombre: process.env.ADMIN1_NAME,
            contrasena: process.env.ADMIN1_PASSWORD,
            correo: process.env.ADMIN1_EMAIL,
            tipo_usuario: process.env.ADMIN_ROLE
        },
        {
            nombre: process.env.ADMIN2_NAME,
            contrasena: process.env.ADMIN2_PASSWORD,
            correo: process.env.ADMIN2_EMAIL,
            tipo_usuario: process.env.ADMIN_ROLE
        },
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

// -----------------------Ruta utilizada-----------------------
// Esta ruta se utiliza para mostrar las 3 gráficas

app.get("/stats", authenticateJWT(['admin']), async (req, res) => {
    //console.log("--------------GET /stats")
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

        const [donationsCountByMethod] = await pool.query(`
            SELECT metodo_pago, COUNT(*) as total
            FROM donaciones
            GROUP BY metodo_pago
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
            cumulativeData,
            donationsCountByMethod // Lista de métodos de pago con el número total de donaciones
        });
    } catch (err) {
        console.error("Error en /donaciones-estadisticas:", err.message);
        res.status(500).send('Error del servidor');
    }
});


// -----------------------Ruta utilizada-----------------------
//Esta ruta se utiliza para mostrar los contatos

app.get('/contacts', authenticateJWT(['admin', 'colaborador','donador']), async (req, res) => {
    console.log("--------------GET /contacts")
    try {
        const [rows, fields] = await pool.query('SELECT * FROM contactos');
        const [countResult] = await pool.query('SELECT COUNT(*) AS count FROM contactos');
        const totalCount = countResult[0].count;

        res.setHeader('X-Total-Count', totalCount);
        res.json({ data: rows, total: totalCount });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
});

// -----------------------Ruta utilizada-----------------------
//Esta ruta se utiliza para registrar nuevos usuarios

app.post("/register", async (req, res) => {
    console.log("--------------POST /register")
    console.log("Petición aceptada")
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

        res.status(201).json({ msg: 'Usuario registrado exitosamente como colaborador' });
    } catch (err) {
        console.error("Error en /register:", err.message);
        res.status(500).send('Error del servidor');
    }
});

//-----------------------Ruta utilizada-----------------------
//Esta ruta se utiliza para iniciar sesión 

app.post("/login", async (req, res) => {
    console.log("--------------POST /login")
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
            console.log("id", user.id);

            res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'None', path: '/' });
            console.log("Token stored in HttpOnly cookie", token);

            res.status(200).json({ tipo_usuario: user.tipo_usuario, user_id: user.id });
        } else {
            res.status(400).json({ msg: 'Contraseña incorrecta' });
        }
    } catch (err) {
        console.error("Error en /login:", err.message);
        res.status(500).send('Error del servidor');
    }
});


//-----------------------Ruta utilizada-----------------------
//Esta ruta se utiliza apra registrar las donaciones

app.post("/donate", authenticateJWT(['admin', 'colaborador', 'donador']), async (req, res) => {
    console.log("--------------POST /donate")
    const { usuario_id, monto, metodo_pago, email } = req.body;

    console.log("Datos recibidos en /donate:", req.body);
    
    try {
        if (!usuario_id || !monto || !metodo_pago) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        const [result] = await pool.query(
            'INSERT INTO donaciones (usuario_id, monto, metodo_pago) VALUES (?, ?, ?)',
            [usuario_id, monto, metodo_pago]
        );

        const [user] = await pool.query('SELECT nombre FROM usuarios WHERE id = ?', [usuario_id]);

        if (!user.length) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        if (email) {
            // Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                return res.status(400).json({ msg: 'Correo electrónico no válido' });
            }

            console.log("Sending email to:", email);
            try {
                await sendThankYouEmail(email, user[0].nombre, monto);
            } catch (emailError) {
                console.error("Error sending email:", emailError);
                return res.status(500).json({ msg: 'Error al enviar el correo de agradecimiento' });
            }
        }

        // Respond with the donation details
        res.status(201).json({ 
            id: result.insertId, 
            usuario_id, 
            monto, 
            metodo_pago, 
            fecha_donacion: new Date() 
        });

    } catch (err) {
        console.error("Error in /donate POST route:", err.message);
        res.status(500).send('Error del servidor');
    }
});

//-----------------------Ruta utilizada-----------------------
// Esta ruta se utiliza para mostrar las donaciones hechas por los donadores

app.get("/donacionesdonadores", authenticateJWT(['admin']), async (req, res) => {
    console.log("--------------GET /donacionesdonadores")
    try {
        const [rows] = await pool.query('SELECT * FROM DonacionesUsuarios');
        console.log(rows);

        const [countResult] = await pool.query('SELECT COUNT(*) as count FROM DonacionesUsuarios');
        const totalCount = countResult[0].count;

        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

        res.json({ rows, total: totalCount });
    } catch (err) {
        console.error("Error in /donacionesDetalladas GET route:", err);
        res.status(500).send('Error del servidor');
    }
});

//-----------------------Ruta utilizada-----------------------
//Esta ruta sirve para crear un nuevo conacto

app.post('/contacts', authenticateJWT(['admin', 'colaborador']), async (req, res) => {
    console.log("--------------POST /contacts")
    const { nombre, telefono, email, direccion, apellido } = req.body;

    if (!nombre || !telefono || !email || !direccion || !apellido) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO contactos (nombre, telefono, email, direccion, apellido) VALUES (?, ?, ?, ?, ?)',
            [nombre, telefono, email, direccion,apellido]
        );

        res.status(201).json({ 
            id: result.insertId, 
            nombre, 
            telefono, 
            email 
        });
    } catch (error) {
        console.error('Error al crear contacto:', error);
        res.status(500).json({ message: 'Error al crear el contacto.' });
    }
});

//-----------------------Ruta utilizada-----------------------
//Ruta para editar un contacto

app.put('/contacts/:id', authenticateJWT(['admin', 'colaborador']), async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, telefono, email, direccion } = req.body;

    if (!nombre || !apellido || !telefono || !email || !direccion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const [result] = await pool.query(
            'CALL actualizar_contacto(?, ?, ?, ?, ?, ?)',
            [id, nombre, apellido, telefono, email, direccion]
        );

        res.status(200).json({ message: 'Contacto actualizado correctamente.' });
    } catch (error) {
        if (error.sqlState === '45000') {
            return res.status(404).json({ message: 'Contacto no encontrado.' });
        }
        console.error('Error al actualizar contacto:', error);
        res.status(500).json({ message: 'Error al actualizar el contacto.' });
    }
});


//-----------------------Ruta utilizada-----------------------
//Sirve para obtener los datos del contacto al editar

app.get('/contacts/:id', authenticateJWT(['admin', 'colaborador']), async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM contactos WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Contacto no encontrado.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener contacto:', error);
        res.status(500).json({ message: 'Error al obtener el contacto.' });
    }
});

// Backend - Registro de colaborador
app.post("/registercolab", authenticateJWT(['admin']), async (req, res) => {
    console.log("Petición aceptada en /registercolab");
    const { username: nombre, password: contrasena, email: correo, role: tipo_usuario } = req.body; 
    console.log("Datos recibidos en /registercolab:", req.body);
    
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [correo]);
        console.log("Usuarios encontrados con el correo dado:", rows);
        
        if (rows.length > 0) {
            console.log("El usuario ya existe");
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);
        const hashedCorreo = await bcrypt.hash(correo, salt);
        await pool.query(
            'CALL registrar_usuario(?, ?, ?, ?)',
            [nombre, hashedPassword, hashedCorreo, tipo_usuario]
        );
        res.status(201).json({ msg: 'Usuario registrado exitosamente como colaborador' });
    } catch (err) {
        console.error("Error en /registercolab:", err.message);
        res.status(500).send('Error del servidor');
    }
});

//-----------------------Ruta utilizada-----------------------
//Esta ruta se utiliza para mostrar las compañías

app.get('/companies', authenticateJWT(['admin', 'colaborador']), async (req, res) => {
    console.log("--------------GET /companies");
    try {
        const [rows] = await pool.query('SELECT * FROM companies');
        console.log(rows)

        const [countResult] = await pool.query('SELECT COUNT(*) as count FROM companies');
        const totalCount = countResult[0].count;

        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json({ data: rows, total: totalCount });
    } catch (err) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: "Error al obtener las compañías." });
    }
});

//-----------------------Ruta utilizada-----------------------
// Endpoint para obtener contactos recientes
app.get('/recentContacts', authenticateJWT(['admin', 'colaborador']), async (req, res) => {
    console.log("--------------GET /recentContacts");
    try {
        const [rows] = await pool.query('SELECT * FROM contactos ORDER BY fecha_creacion DESC LIMIT 5');
        const [countResult] = await pool.query('SELECT COUNT(*) as count FROM contactos');
        const totalCount = countResult[0].count;

        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json({ data: rows, total: totalCount });
    } catch (error) {
        console.error("Error fetching recent contacts:", error);
        res.status(500).json({ message: "Error al obtener los contactos recientes." });
    }
});

// Endpoint para obtener estadísticas de usuarios
app.get('/userStats', authenticateJWT(['admin', 'colaborador']), async (req, res) => {
    console.log("--------------GET /userStats");
    try {
        const [rows] = await pool.query('SELECT tipo_usuario, COUNT(*) as cantidad FROM usuarios GROUP BY tipo_usuario');
        const [countResult] = await pool.query('SELECT COUNT(*) as count FROM usuarios');
        const totalCount = countResult[0].count;

        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json({ data: rows, total: totalCount });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ message: "Error al obtener estadísticas de usuarios." });
    }
});

// Endpoint para obtener donaciones recientes
app.get('/recentDonations', authenticateJWT(['admin', 'colaborador']), async (req, res) => {
    console.log("--------------GET /recentDonations");
    try {
        const [rows] = await pool.query('SELECT * FROM DonacionesUsuarios ORDER BY donacion_fecha DESC LIMIT 5');
        const [countResult] = await pool.query('SELECT COUNT(*) as count FROM donaciones');
        const totalCount = countResult[0].count;

        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json({ data: rows, total: totalCount });
    } catch (error) {
        console.error("Error fetching recent donations:", error);
        res.status(500).json({ message: "Error al obtener las donaciones recientes." });
    }
});

// Endpoint para obtener compañías
app.get('/latestCompanies', authenticateJWT(['admin', 'colaborador']), async (req, res) => {
    console.log("--------------GET /companies");
    try {
        const [rows] = await pool.query('SELECT * FROM companies');
        console.log(rows);

        const [countResult] = await pool.query('SELECT COUNT(*) as count FROM companies');
        const totalCount = countResult[0].count;

        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json({ data: rows, total: totalCount });
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: "Error al obtener las compañías." });
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
