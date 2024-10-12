"use strict";

import mysql from "mysql2/promise";
import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";
import 'dotenv/config';

const pool = mysql.createPool({
    connectionLimit: process.env.CON_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE, 
});

// Número de registros a insertar
const USERS_TO_CREATE = 10;
const DONATIONS_TO_CREATE = 50;
const CONTACTS_TO_CREATE = 20;

// Crear usuarios falsos
async function createDummyUsers() {
    for (let i = 0; i < USERS_TO_CREATE; i++) {
        const nombre = faker.name.firstName();
        const correo = faker.internet.email();
        const contrasena = "1";  // Contraseña fija como "1"
        const tipo_usuario = faker.helpers.arrayElement(['donador', 'colaborador', 'admin']);

        const salt = await bcrypt.genSalt(10);  // Genera el salt
        const hashedPassword = await bcrypt.hash(contrasena, salt);  // Hashea la contraseña
        const hashedCorreo = await bcrypt.hash(correo, salt);  // Hashea el correo para mayor seguridad (opcional)

        try {
            await pool.query('CALL registrar_usuario(?, ?, ?, ?)', 
                [nombre, hashedPassword, hashedCorreo, tipo_usuario]
            );
            console.log(`Usuario ${nombre} creado exitosamente con contraseña hasheada`);
        } catch (err) {
            console.error(`Error creando usuario ${nombre}:`, err.message);
        }
    }
}


// Crear donaciones falsas
async function createDummyDonations() {
    for (let i = 0; i < DONATIONS_TO_CREATE; i++) {
        const usuario_id = faker.datatype.number({ min: 1, max: USERS_TO_CREATE });
        const monto = faker.finance.amount(10, 500, 2);
        const metodo_pago = faker.helpers.arrayElement(['Tarjeta', 'PayPal', 'Transferencia']);
        
        try {
            await pool.query('INSERT INTO donaciones (usuario_id, monto, metodo_pago) VALUES (?, ?, ?)', 
                [usuario_id, monto, metodo_pago]
            );
            console.log(`Donación de ${monto} creada exitosamente`);
        } catch (err) {
            console.error(`Error creando donación:`, err.message);
        }
    }
}

// Crear contactos falsos
async function createDummyContacts() {
    for (let i = 0; i < CONTACTS_TO_CREATE; i++) {
        const nombre = faker.name.firstName();
        const apellido = faker.name.lastName();
        const telefono = faker.phone.number();
        const email = faker.internet.email();
        const direccion = faker.address.streetAddress();

        try {
            await pool.query('INSERT INTO contactos (nombre, apellido, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)', 
                [nombre, apellido, telefono, email, direccion]
            );
            console.log(`Contacto ${nombre} ${apellido} creado exitosamente`);
        } catch (err) {
            console.error(`Error creando contacto:`, err.message);
        }
    }
}

// Llamar a las funciones para generar los datos dummy
(async () => {
    await createDummyUsers();
    await createDummyDonations();
    await createDummyContacts();
    console.log("Datos dummy creados exitosamente");
    pool.end(); // Cerrar la conexión a la base de datos
})();
