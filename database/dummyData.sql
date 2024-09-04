INSERT INTO usuarios (nombre, contrasena, correo, tipo_usuario) VALUES
('Usuario1', 'contrasena1', 'usuario1@example.com', 'donador'),
('Usuario2', 'contrasena2', 'usuario2@example.com', 'donador'),
('Usuario3', 'contrasena3', 'usuario3@example.com', 'donador'),
('Usuario4', 'contrasena4', 'usuario4@example.com', 'donador'),
('Usuario5', 'contrasena5', 'usuario5@example.com', 'donador'),
('Usuario6', 'contrasena6', 'usuario6@example.com', 'donador'),
('Usuario7', 'contrasena7', 'usuario7@example.com', 'donador'),
('Usuario8', 'contrasena8', 'usuario8@example.com', 'donador'),
('Usuario9', 'contrasena9', 'usuario9@example.com', 'donador'),
('Usuario10', 'contrasena10', 'usuario10@example.com', 'donador');

INSERT INTO donaciones (usuario_id, monto, metodo_pago, fecha_donacion) VALUES
(1, 50.00, 'Tarjeta de Crédito', '2024-09-01 10:30:00'),
(2, 100.00, 'PayPal', '2024-09-02 14:45:00'),
(3, 25.75, 'Transferencia Bancaria', '2024-09-03 09:15:00'),
(4, 200.00, 'Tarjeta de Débito', '2024-09-04 16:00:00'),
(5, 75.50, 'Tarjeta de Crédito', '2024-09-05 11:20:00'),
(6, 30.00, 'Efectivo', '2024-09-06 13:10:00'),
(7, 120.00, 'PayPal', '2024-09-07 17:45:00'),
(8, 60.00, 'Transferencia Bancaria', '2024-09-08 10:05:00'),
(9, 90.25, 'Tarjeta de Débito', '2024-09-09 12:50:00'),
(10, 150.00, 'Tarjeta de Crédito', '2024-09-10 15:30:00');

