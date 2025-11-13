-- ? 1. Vista para mostrar brokers agrupados por estado
-- ? 2. Facilita revision de solicitudes pendientes y gestion
-- ? 3. Incluye informacion de aseguradora para contexto

CREATE OR REPLACE VIEW v_brokers_by_status AS
SELECT 
    -- ? 4. Estado del broker para agrupacion
    b.estado_broker,
    
    -- ? 5. Informacion basica del broker
    b.id_broker,
    r.correo_registro AS email,
    b.nombre_prim_broker,
    b.apellido_prim_broker,
    b.full_nombre_broker,
    b.numero_telefono_broker,
    
    -- ? 6. Fechas importantes
    r.fecha_registro AS application_date,
    
    -- ? 7. Informacion de la aseguradora
    a.nombre_aseguradora,
    a.dominio_correo_aseguradora,
    
    -- ? 8. Rol asignado si ya fue aprobado
    rb.rol_broker AS current_role,
    
    -- ? 9. Indicador si tiene rol asignado
    CASE 
        WHEN rb.id_rol_broker IS NOT NULL THEN 'Si'
        ELSE 'No'
    END AS has_role_assigned
    
FROM Registro_SignUp_Global r
    -- ? 10. Join con brokers
    INNER JOIN Registro_Global_Brokers b ON r.id_identidad = b.id_identidad_registro
    
    -- ? 11. Join con aseguradoras
    INNER JOIN Aseguradoras a ON b.id_aseguradora = a.id_aseguradora
    
    -- ? 12. Left join con roles para ver asignaciones
    LEFT JOIN Roles_Broker rb ON b.id_broker = rb.id_broker
    
-- ? 13. Solo registros activos
WHERE r.estado_actividad_registro = 'activo'

-- ? 14. Ordenar por prioridad de estado y fecha
ORDER BY 
    CASE b.estado_broker
        WHEN 'pendiente' THEN 1
        WHEN 'activo' THEN 2
        WHEN 'rechazado' THEN 3
        ELSE 4
    END,
    r.fecha_registro ASC;