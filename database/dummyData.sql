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
(5, 4, 300.00, 'PayPal','2024-09-24'),
(6, 1, 120.00, 'Tarjeta de Crédito', '2024-10-05'),
(7, 2, 45.00, 'Efectivo', '2024-10-06'),
(8, 3, 78.25, 'PayPal', '2024-10-07'),
(9, 4, 55.00, 'Transferencia Bancaria', '2024-10-08'),
(10, 5, 95.00, 'Tarjeta de Débito', '2024-10-09'),
(11, 1, 180.00, 'Tarjeta de Crédito', '2024-10-10'),
(12, 2, 60.00, 'PayPal', '2024-10-11'),
(13, 3, 85.00, 'Efectivo', '2024-10-12'),
(14, 4, 50.00, 'Tarjeta de Débito', '2024-10-13'),
(15, 5, 110.00, 'Transferencia Bancaria', '2024-10-14'),
(16, 1, 100.00, 'Efectivo', '2024-10-15'),
(17, 2, 55.00, 'Tarjeta de Crédito', '2024-10-16'),
(18, 3, 65.00, 'Tarjeta de Débito', '2024-10-17'),
(19, 4, 120.00, 'PayPal', '2024-10-18'),
(20, 5, 130.00, 'Transferencia Bancaria', '2024-10-19'),
(21, 1, 150.00, 'PayPal', '2024-10-20'),
(22, 2, 70.00, 'Efectivo', '2024-10-21'),
(23, 3, 90.00, 'Tarjeta de Crédito', '2024-10-22'),
(24, 4, 110.00, 'Tarjeta de Débito', '2024-10-23'),
(25, 5, 200.00, 'PayPal', '2024-10-24');


INSERT INTO companies (company, email, number) VALUES
('Bright Future Energy', 'info@brightfutureenergy.com', '123-321-1234'),
('Urban Farms Ltd.', 'contact@urbanfarms.com', '234-432-2345'),
('Cyber Security Solutions', 'support@cybersecurity.com', '345-543-3456'),
('Fashion Hub', 'hello@fashionhub.com', '456-654-4567'),
('Pet Care Services', 'sales@petcareservices.com', '567-765-5678'),
('Home Decor Studio', 'info@homedecorstudio.com', '678-876-6789'),
('Fitness Factory', 'contact@fitnessfactory.com', '789-987-7890'),
('Travel Expeditions', 'support@travelexpeditions.com', '890-098-8901'),
('Gourmet Delights', 'hello@gourmetdelights.com', '901-109-9012'),
('Virtual Events Co.', 'sales@virtualevents.com', '012-210-0123');