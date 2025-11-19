-- =====================================================
-- DATOS DE BIENES POR USUARIO Y BIENES ASEGURADOS
-- =====================================================

-- Insertar bienes por usuario (basado en el tipo de poliza que tienen)
INSERT INTO BienesPorUsuario (id_usuario, valoracion_bien, tipo_de_bien) VALUES
-- Juan Perez (tiene seguro automotriz - Policy 1)
(3, 22000.00, 'bien_automotriz'),

-- Maria Gonzalez (tiene seguro inmobiliario - Policy 3) 
(4, 95000.00, 'bien_inmueble'),

-- Carlos Rodriguez (tiene seguro automotriz - Policy 5)
(5, 32000.00, 'bien_automotriz'),

-- Ana Martinez (tiene seguro automotriz - Policy 7)
(6, 26500.00, 'bien_automotriz'),

-- Luis Fernandez (tiene seguro automotriz - Policy 9)
(7, 15000.00, 'bien_automotriz');

-- Asociar bienes asegurados con registros de poliza (solo para seguros de auto e inmobiliario)
INSERT INTO BienesAseguradosPorUsuario (id_registro_en_poliza, id_bien_del_usuario, fecha_asociacion_cobertura_a_bien) VALUES
-- Juan Perez: Auto insurance - asociar vehiculo
(1, 1, '2024-11-01'),

-- Maria Gonzalez: Property insurance - asociar inmueble  
(2, 2, '2024-11-01'),

-- Carlos Rodriguez: Auto insurance - asociar vehiculo
(3, 3, '2024-11-01'),

-- Ana Martinez: Auto insurance - asociar vehiculo
(4, 4, '2024-11-01'),

-- Luis Fernandez: Auto insurance - asociar vehiculo
(5, 5, '2024-11-01');