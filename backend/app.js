"use strict"

import express from "express"
import mysql from "mysql2"
import bodyParser from "body-parser"
import bcrypt from "bcryptjs"
import cors from "cors"
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = mysql.createPool({
    connectionLimit: 10, 
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE, 
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      
      pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;
  
        if (results.length > 0) {
          return res.status(400).json({ msg: 'User already exists' });
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        pool.query(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          [username, hashedPassword],
          (err, result) => {
            if (err) throw err;
            res.status(201).json({ msg: 'User registered successfully' });
          }
        );
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
