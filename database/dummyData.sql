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
('Usuario10','1234', 'usuario10@mail.com', 'donador');

INSERT INTO donaciones (usuario_id, monto, metodo_pago, fecha_donacion) VALUES
(2, 100.00, 'PayPal', '2024-09-02 14:45:00'),
(3, 25.75, 'Transferencia Bancaria', '2024-09-03 09:15:00'),
(4, 200.00, 'Tarjeta de Débito', '2024-09-04 16:00:00'),
(5, 75.50, 'Tarjeta de Crédito', '2024-09-05 11:20:00'),
(6, 30.00, 'Efectivo', '2024-09-06 13:10:00'),
(7, 120.00, 'PayPal', '2024-09-07 17:45:00'),
(8, 60.00, 'Transferencia Bancaria', '2024-09-08 10:05:00'),
(9, 90.25, 'Tarjeta de Débito', '2024-09-09 12:50:00'),
(10, 150.00, 'Tarjeta de Crédito', '2024-09-10 15:30:00');

INSERT INTO contactos (nombre, apellido, email, telefono, direccion) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', '5551234567', 'Calle Falsa 123, Ciudad A'),
('Ana', 'García', 'ana.garcia@example.com', '5559876543', 'Avenida Central 456, Ciudad B'),
('Luis', 'Martínez', 'luis.martinez@example.com', '5556543210', 'Boulevard Principal 789, Ciudad C'),
('María', 'Rodríguez', 'maria.rodriguez@example.com', '5558765432', 'Calle Secundaria 101, Ciudad D'),
('Pedro', 'López', 'pedro.lopez@example.com', '5553456789', 'Pasaje Nuevo 202, Ciudad E'),
('Carmen', 'Fernández', 'carmen.fernandez@example.com', '5554567890', 'Camino Viejo 303, Ciudad F'),
('Diego', 'Gómez', 'diego.gomez@example.com', '5552345678', 'Avenida Nueva 404, Ciudad G'),
('Lucía', 'Ramírez', 'lucia.ramirez@example.com', '5551239876', 'Calle Tercera 505, Ciudad H'),
('Roberto', 'Sánchez', 'roberto.sanchez@example.com', '5557891234', 'Plaza Mayor 606, Ciudad I'),
('Elena', 'Díaz', 'elena.diaz@example.com', '5555678901', 'Ruta Antigua 707, Ciudad J');

