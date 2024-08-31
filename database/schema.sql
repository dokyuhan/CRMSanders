DROP DATABASE IF EXISTS crmSanders;
CREATE DATABASE IF NOT EXISTS crmSanders;
USE  crmSanders;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,  
    correo VARCHAR(100) NOT NULL UNIQUE,  
    tipo_usuario ENUM('admin', 'donador') NOT NULL
);

CREATE TABLE IF NOT EXISTS donaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    fecha_donacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

DELIMITER $$

CREATE PROCEDURE registrar_usuario(
    IN p_nombre VARCHAR(50),
    IN p_contrasena VARCHAR(100),  
    IN p_correo VARCHAR(100),
    IN p_tipo_usuario ENUM('admin', 'donador')
)
BEGIN
    INSERT INTO usuarios (nombre, contrasena, correo, tipo_usuario)
    VALUES (p_nombre, p_contrasena, p_correo, p_tipo_usuario);
END $$

DELIMITER $$

CREATE PROCEDURE registrar_donacion(
    IN p_usuario_id INT,
    IN p_monto DECIMAL(10, 2),
    IN p_metodo_pago VARCHAR(50)
)
BEGIN
    DECLARE tipo ENUM('admin', 'donador');

    SELECT tipo_usuario INTO tipo FROM usuarios WHERE id = p_usuario_id;

    IF tipo = 'donador' THEN
        INSERT INTO donaciones (usuario_id, monto, metodo_pago)
        VALUES (p_usuario_id, p_monto, p_metodo_pago);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo los donadores pueden realizar donaciones';
    END IF;
END $$

DELIMITER ;
