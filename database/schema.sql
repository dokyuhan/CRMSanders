DROP DATABASE IF EXISTS crmSanders;
CREATE DATABASE IF NOT EXISTS crmSanders;
USE  crmSanders;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,  
    correo VARCHAR(100) NOT NULL UNIQUE,  
    tipo_usuario ENUM('admin', 'colaborador','donador') NOT NULL
);

CREATE TABLE IF NOT EXISTS donaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    fecha_donacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW DonacionesUsuarios AS
SELECT
    d.id AS donacion_id,
    u.id AS usuario_id,
    u.nombre AS usuario_nombre,
    u.correo AS usuario_correo,
    d.monto AS donacion_monto,
    d.metodo_pago AS donacion_metodo_pago,
    d.fecha_donacion AS donacion_fecha
FROM
    donaciones d
JOIN
    usuarios u ON d.usuario_id = u.id;


DELIMITER $$
CREATE PROCEDURE registrar_usuario(
    IN p_nombre VARCHAR(50),
    IN p_contrasena VARCHAR(100),  
    IN p_correo VARCHAR(100),
    IN p_tipo_usuario ENUM('admin', 'colaborador','donador')
)
BEGIN
    INSERT INTO usuarios (nombre, contrasena, correo, tipo_usuario)
    VALUES (p_nombre, p_contrasena, p_correo, p_tipo_usuario);
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE registrar_donador(
    IN p_nombre VARCHAR(50),
    IN p_contrasena VARCHAR(100),  
    IN p_correo VARCHAR(100)
)
BEGIN
    INSERT INTO donadores (nombre, contrasena, correo)
    VALUES (p_nombre, p_contrasena, p_correo);
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE registrar_donacion(
    IN p_donador_id INT,
    IN p_monto DECIMAL(10, 2),
    IN p_metodo_pago VARCHAR(50)
)
BEGIN
    DECLARE existe_donador INT;

    SELECT COUNT(*) INTO existe_donador FROM donadores WHERE id = p_donador_id;

    IF existe_donador = 1 THEN
        INSERT INTO donaciones (donador_id, monto, metodo_pago)
        VALUES (p_donador_id, p_monto, p_metodo_pago);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El donador no existe';
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE actualizar_contacto(
    IN p_id INT,
    IN p_nombre VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_telefono VARCHAR(15),
    IN p_email VARCHAR(255),
    IN p_direccion VARCHAR(255)
)
BEGIN
    UPDATE contactos
    SET nombre = p_nombre, apellido = p_apellido, telefono = p_telefono, email = p_email, direccion = p_direccion
    WHERE id = p_id;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Contacto no encontrado.';
    END IF;
END $$
DELIMITER ;

select * from usuarios;

 
