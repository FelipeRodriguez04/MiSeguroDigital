-- ? 1. Vista para mostrar usuarios agrupados por rol
-- ? 2. Facilita la administracion mostrando usuarios por nivel de autorizacion
-- ? 3. Incluye conteos por rol para reportes administrativos

CREATE OR REPLACE VIEW v_usuarios_by_role AS
SELECT 
    -- ? 4. Informacion del rol
    ru.rol_usuario AS role_name,
    
    -- ? 5. Informacion basica del usuario
    u.id_usuario,
    r.correo_registro AS email,
    u.nombre_prim_usuario,
    u.apellido_prim_usuario,
    u.full_nombre_usuario,
    u.numero_telefono_usuario,
    
    -- ? 6. Estado y fechas
    r.estado_actividad_registro AS is_active,
    r.fecha_registro AS created_at,
    
    -- ? 7. Informacion adicional de broker si aplica
    CASE 
        WHEN rb.id_broker IS NOT NULL THEN 'Si'
        ELSE 'No'
    END AS is_broker,
    rb.estado_broker AS broker_status
    
FROM Registro_SignUp_Global r
    -- ? 8. Join con usuarios para informacion personal
    INNER JOIN Registro_Global_Usuarios u ON r.id_identidad = u.id_identidad_registro
    
    -- ? 9. Join con roles para obtener nivel de autorizacion
    INNER JOIN Roles_Users ru ON u.id_usuario = ru.id_usuario
    
    -- ? 10. Left join con brokers para identificar usuarios broker
    LEFT JOIN Registro_Global_Brokers rb ON r.id_identidad = rb.id_identidad_registro
    
-- ? 11. Solo mostrar usuarios activos
WHERE r.estado_actividad_registro = 'activo'

-- ? 12. Ordenar por rol y luego por fecha de registro
ORDER BY 
    CASE ru.rol_usuario
        WHEN 'global_superadmin' THEN 1
        WHEN 'global_admin' THEN 2
        WHEN 'global_user' THEN 3
        ELSE 4
    END,
    r.fecha_registro DESC;