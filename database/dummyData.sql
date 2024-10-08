Use crmsanders;
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
('Elena', 'Díaz', 'elena.diaz@example.com', '5555678901', 'Ruta Antigua 707, Ciudad J');

INSERT INTO donaciones (id, usuario_id, monto, metodo_pago, fecha_donacion) VALUES
(1, 1, 100.50, 'Tarjeta de Crédito', '2024-09-20'),
(2, 2, 50.00, 'PayPal', '2024-09-21'),
(3, 3, 75.25, 'Transferencia Bancaria', '2024-09-22'),
(4, 1, 200.00, 'Tarjeta de Débito', '2024-09-23'),
(5, 4, 300.00, 'PayPal','2024-09-24');
