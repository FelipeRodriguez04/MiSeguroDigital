-- ? 1. Vista para mostrar brokers con informacion consolidada
-- ? 2. Une tablas de registro, brokers, aseguradoras y roles
-- ? 3. Muestra solo brokers activos para administracion

CREATE OR REPLACE VIEW v_brokers_basic AS
SELECT 
    -- ? 4. Campos principales del broker
    b.id_broker,
    r.correo_registro AS email,
    b.nombre_prim_broker,
    b.apellido_prim_broker,
    b.full_nombre_broker,
    b.numero_telefono_broker,
    b.fecha_nacimiento_broker,
    
    -- ? 5. Estado del broker y fechas
    b.estado_broker,
    r.estado_actividad_registro AS is_active,
    r.fecha_registro AS created_at,
    
    -- ? 6. Informacion de la aseguradora
    a.id_aseguradora,
    a.nombre_aseguradora,
    a.dominio_correo_aseguradora,
    
    -- ? 7. Rol del broker si tiene asignado
    rb.rol_broker AS broker_role
    
FROM Registro_SignUp_Global r
    -- ? 8. Join con brokers para informacion personal
    INNER JOIN Registro_Global_Brokers b ON r.id_identidad = b.id_identidad_registro
    
    -- ? 9. Join con aseguradoras para informacion de la empresa
    INNER JOIN Aseguradoras a ON b.id_aseguradora = a.id_aseguradora
    
    -- ? 10. Left join con roles de broker para obtener nivel
    LEFT JOIN Roles_Broker rb ON b.id_broker = rb.id_broker
    
-- ? 11. Solo mostrar registros activos
WHERE r.estado_actividad_registro = 'activo'

-- ? 12. Ordenar por estado del broker y fecha de registro
ORDER BY 
    CASE b.estado_broker
        WHEN 'pendiente' THEN 1
        WHEN 'activo' THEN 2
        WHEN 'rechazado' THEN 3
        ELSE 4
    END,
    r.fecha_registro DESC;