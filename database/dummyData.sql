INSERT INTO usuarios (nombre, contrasena, correo, tipo_usuario) VALUES
('Usuario1', '1234', 'usuario1@mail.com', 'donador'),
('Usuario2', '1234', 'usuario2@mail.com', 'donador'),
('Usuario3', '1234', 'usuario3@mail.com', 'donador'),
('Usuario4', '1234', 'usuario4@mail.com', 'donador'),
('Usuario5', '1234', 'usuario5@mail.com', 'donador'),
('Usuario6', '1234', 'usuario6@mail.com', 'donador'),
('Usuario7', '1234', 'usuario7@mail.com', 'donador'),
('Usuario8', '1234', 'usuario8@mail.com', 'donador'),
('Usuario9', '1234', 'usuario9@mail.com', 'donador'),
('Usuario10', '1234', 'usuario10@mail.com', 'donador');

INSERT INTO donaciones (usuario_id, monto, metodo_pago, fecha_donacion) VALUES
(2, 100.00, 'PayPal', '2024-09-02 14:45:00'),
(3, 25.75, 'Transferencia Bancaria', '2024-09-03 09:15:00'),
(4, 200.00, 'Tarjeta de Débito', '2024-09-04 16:00:00'),
(5, 75.50, 'Tarjeta de Crédito', '2024-09-05 11:20:00'),
(6, 30.00, 'Efectivo', '2024-09-06 13:10:00'),
(7, 120.00, 'PayPal', '2024-09-07 17:45:00'),
(8, 60.00, 'Transferencia Bancaria', '2024-09-08 10:05:00'),
(9, 90.25, 'Tarjeta de Débito', '2024-09-09 12:50:00'),
(10, 150.00, 'Tarjeta de Crédito', '2024-09-10 15:30:00'),
(11, 50.00, 'Tarjeta de Crédito', '2024-09-01 10:30:00'),;

