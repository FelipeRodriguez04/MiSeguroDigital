-- =====================================================
-- SECCION DE CARGA DE DATOS INICIALES
-- =====================================================

-- Insertar aseguradoras
INSERT INTO Aseguradoras (nombre_aseguradora, dominio_correo_aseguradora, calle_principal_aseguradora, calle_secundaria_aseguradora, numero_oficina_aseguradora, telefono_aseguradora, sitio_web_aseguradora) VALUES
('Seguros Bolivar', 'bolivar.com.ec', 'Av. Amazonas', 'Calle Colon', '1501', '02-2234567', 'www.bolivar.com.ec'),
('Equinoccial Seguros', 'equinoccial.com', 'Av. 6 de Diciembre', 'Calle Orellana', '2304', '02-2345678', 'www.equinoccial.com'),
('Seguros Sucre', 'sucre.com.ec', 'Av. Patria', 'Calle 10 de Agosto', '1205', '02-2456789', 'www.sucre.com.ec'),
('Liberty Seguros', 'liberty.com.ec', 'Av. Republica', 'Calle Eloy Alfaro', '3401', '02-2567890', 'www.liberty.com.ec'),
('QBE Seguros Colonial', 'qbe.com.ec', 'Av. Naciones Unidas', 'Calle Shyris', '4502', '02-2678901', 'www.qbe.com.ec'),
('Seguros Unidos', 'unidos.com.ec', 'Av. Occidental', 'Calle Mariscal Foch', '1803', '02-2789012', 'www.unidos.com.ec'),
('Mapfre Atlas', 'mapfre.com.ec', 'Av. Rio Amazonas', 'Calle Wilson', '2701', '02-2890123', 'www.mapfre.com.ec'),
('Ace Seguros', 'ace.com.ec', 'Av. Gonzalez Suarez', 'Calle Calama', '3205', '02-2901234', 'www.ace.com.ec'),
('Seguros Rocafuerte', 'rocafuerte.com.ec', 'Av. America', 'Calle Rumipamba', '1604', '02-3012345', 'www.rocafuerte.com.ec'),
('Panamerican Life', 'panam.com.ec', 'Av. Francisco de Orellana', 'Calle Las Monjas', '4801', '02-3123456', 'www.panam.com.ec');

-- Insertar registros de identidad para usuarios globales
INSERT INTO Registro_SignUp_Global (correo_registro, hashed_pwd_registro, hashed_pwd_salt_registro) VALUES
('admin@miseguro.com', '', ''),
('superadmin@miseguro.com', '', ''),
('juan.perez@gmail.com', '', ''),
('maria.gonzalez@hotmail.com', '', ''),
('carlos.rodriguez@yahoo.com', '', ''),
('ana.martinez@gmail.com', '', ''),
('luis.fernandez@outlook.com', '', '');

-- Insertar usuarios globales
INSERT INTO Registro_Global_Usuarios (id_identidad_registro, nombre_prim_usuario, apellido_prim_usuario, full_nombre_usuario, numero_telefono_usuario, fecha_nacimiento_usuario) VALUES
(1, 'Admin', 'Sistema', 'Admin Sistema', '0999123456', '1985-01-15'),
(2, 'Super', 'Admin', 'Super Admin', '0999654321', '1980-03-20'),
(3, 'Juan', 'Perez', 'Juan Carlos Perez Lopez', '0987654321', '1990-05-12'),
(4, 'Maria', 'Gonzalez', 'Maria Elena Gonzalez Ruiz', '0976543210', '1988-08-25'),
(5, 'Carlos', 'Rodriguez', 'Carlos Alberto Rodriguez Mora', '0965432109', '1992-11-03'),
(6, 'Ana', 'Martinez', 'Ana Sofia Martinez Vega', '0954321098', '1995-02-18'),
(7, 'Luis', 'Fernandez', 'Luis Miguel Fernandez Castro', '0943210987', '1987-07-30');

-- Asignar roles a usuarios globales
INSERT INTO Roles_Users (id_usuario, rol_usuario) VALUES
(1, 'global_admin'),
(2, 'global_superadmin'),
(3, 'global_user'),
(4, 'global_user'),
(5, 'global_user'),
(6, 'global_user'),
(7, 'global_user');

-- Insertar registros de identidad para brokers
INSERT INTO Registro_SignUp_Global (correo_registro, hashed_pwd_registro, hashed_pwd_salt_registro) VALUES
('broker.admin@bolivar.com.ec', '', ''),
('pedro.silva@equinoccial.com', '', ''),
('sofia.torres@sucre.com.ec', '', ''),
('miguel.herrera@liberty.com.ec', '', ''),
('laura.castro@qbe.com.ec', '', ''),
('diego.morales@unidos.com.ec', '', ''),
('analyst@mapfre.com.ec', '', '');

-- Insertar brokers
INSERT INTO Registro_Global_Brokers (id_identidad_registro, id_aseguradora, nombre_prim_broker, apellido_prim_broker, full_nombre_broker, numero_telefono_broker, fecha_nacimiento_broker, estado_broker) VALUES
(8, 1, 'Broker', 'Admin', 'Broker Admin Bolivar', '0998765432', '1983-04-10', 'activo'),
(9, 2, 'Pedro', 'Silva', 'Pedro Antonio Silva Mendez', '0987654320', '1986-09-15', 'activo'),
(10, 3, 'Sofia', 'Torres', 'Sofia Isabel Torres Jimenez', '0976543219', '1989-12-08', 'activo'),
(11, 4, 'Miguel', 'Herrera', 'Miguel Angel Herrera Vargas', '0965432108', '1991-06-22', 'activo'),
(12, 5, 'Laura', 'Castro', 'Laura Patricia Castro Delgado', '0954321097', '1984-01-28', 'activo'),
(13, 6, 'Diego', 'Morales', 'Diego Fernando Morales Espinoza', '0943210986', '1993-10-14', 'activo'),
(14, 7, 'Analyst', 'Mapfre', 'Analyst Broker Mapfre', '0932109875', '1988-03-05', 'activo');

-- Asignar roles a brokers
INSERT INTO Roles_Broker (id_broker, rol_broker) VALUES
(1, 'broker_admin'),
(2, 'broker_analyst'),
(3, 'broker_analyst'),
(4, 'broker_analyst'),
(5, 'broker_analyst'),
(6, 'broker_analyst'),
(7, 'broker_analyst');

-- Insertar polizas (2 por aseguradora, diferentes tipos)
INSERT INTO PolizasDeSeguro (id_aseguradora, nombre_de_la_poliza, descripcion_de_la_poliza, tipo_de_poliza, pago_mensual, monto_cobertura_total, duracion_de_contrato, porcentaje_de_aprobacion, importe_por_cancelacion, estado_de_poliza) VALUES
-- Seguros Bolivar
(1, 'Seguro Auto Bolivar Plus', 'Cobertura completa para vehiculos con asistencia 24/7', 'seguro_automotriz', 85.50, 25000.00, 12, 92.5, 150.00, 'activa'),
(1, 'Vida Protegida Bolivar', 'Seguro de vida con cobertura por muerte e invalidez', 'seguro_de_vida', 45.00, 50000.00, 24, 88.0, 75.00, 'activa'),

-- Equinoccial Seguros
(2, 'Hogar Seguro Equinoccial', 'Proteccion integral para tu hogar y contenido', 'seguro_inmobiliario', 65.75, 80000.00, 12, 90.0, 120.00, 'activa'),
(2, 'Salud Total Equinoccial', 'Plan de salud con cobertura nacional e internacional', 'seguro_de_salud', 125.00, 15000.00, 12, 85.5, 200.00, 'activa'),

-- Seguros Sucre
(3, 'Auto Clasico Sucre', 'Seguro basico para vehiculos con cobertura esencial', 'seguro_automotriz', 55.25, 18000.00, 12, 94.0, 100.00, 'activa'),
(3, 'Casa Protegida Sucre', 'Seguro residencial con cobertura contra incendios y robos', 'seguro_inmobiliario', 78.90, 120000.00, 24, 87.5, 180.00, 'activa'),

-- Liberty Seguros
(4, 'Vida Liberty Premium', 'Seguro de vida premium con beneficios adicionales', 'seguro_de_vida', 95.00, 100000.00, 36, 82.0, 250.00, 'activa'),
(4, 'Salud Liberty Familiar', 'Plan familiar de salud con cobertura amplia', 'seguro_de_salud', 180.50, 25000.00, 12, 89.0, 300.00, 'activa'),

-- QBE Seguros Colonial
(5, 'Auto QBE Ejecutivo', 'Seguro premium para vehiculos ejecutivos', 'seguro_automotriz', 110.00, 35000.00, 12, 91.0, 220.00, 'activa'),
(5, 'Oficina Segura QBE', 'Proteccion comercial para oficinas y equipos', 'seguro_inmobiliario', 145.75, 200000.00, 24, 86.0, 350.00, 'activa'),

-- Seguros Unidos
(6, 'Vida Joven Unidos', 'Seguro de vida especial para jovenes profesionales', 'seguro_de_vida', 35.50, 30000.00, 12, 93.5, 60.00, 'activa'),
(6, 'Salud Unidos Basico', 'Plan basico de salud con cobertura nacional', 'seguro_de_salud', 75.25, 8000.00, 12, 91.5, 125.00, 'activa'),

-- Mapfre Atlas
(7, 'Auto Mapfre Integral', 'Cobertura integral con asistencia en carretera', 'seguro_automotriz', 92.80, 28000.00, 12, 89.5, 185.00, 'activa'),
(7, 'Hogar Mapfre Completo', 'Seguro residencial con cobertura completa', 'seguro_inmobiliario', 88.60, 150000.00, 24, 88.5, 210.00, 'activa'),

-- Ace Seguros
(8, 'Vida Ace Garantizada', 'Seguro de vida con aceptacion garantizada', 'seguro_de_vida', 68.75, 40000.00, 24, 95.0, 140.00, 'activa'),
(8, 'Salud Ace Premium', 'Plan premium de salud con cobertura internacional', 'seguro_de_salud', 220.00, 50000.00, 12, 83.0, 400.00, 'activa'),

-- Seguros Rocafuerte
(9, 'Auto Rocafuerte Economico', 'Seguro economico para vehiculos usados', 'seguro_automotriz', 42.30, 12000.00, 12, 96.0, 80.00, 'activa'),
(9, 'Casa Rocafuerte Basica', 'Proteccion basica para viviendas', 'seguro_inmobiliario', 52.40, 60000.00, 12, 92.0, 95.00, 'activa'),

-- Panamerican Life
(10, 'Vida Panamerican Elite', 'Seguro de vida elite con multiples beneficios', 'seguro_de_vida', 150.00, 200000.00, 60, 78.0, 500.00, 'activa'),
(10, 'Salud Panamerican Global', 'Cobertura de salud global con atencion mundial', 'seguro_de_salud', 350.75, 100000.00, 12, 80.0, 750.00, 'activa');