-- ? 1. Vista para mostrar usuarios basicos con informacion consolidada
-- ? 2. Une tablas de registro, usuarios y roles para mostrar informacion completa
-- ? 3. Filtra solo usuarios activos para operaciones de administracion

CREATE OR REPLACE VIEW v_usuarios_basic AS
SELECT 
    -- ? 4. Campos principales del usuario
    u.id_usuario,
    r.correo_registro AS email,
    u.nombre_prim_usuario,
    u.apellido_prim_usuario,
    u.full_nombre_usuario,
    u.numero_telefono_usuario,
    u.fecha_nacimiento_usuario,
    
    -- ? 5. Estado y fechas de registro
    r.estado_actividad_registro AS is_active,
    r.fecha_registro AS created_at,
    
    -- ? 6. Informacion de roles del usuario
    ru.rol_usuario AS role_name,
    
    -- ? 7. Informacion de broker si aplica (puede ser NULL)
    rb.id_broker AS broker_id,
    rb.estado_broker AS broker_status
    
FROM Registro_SignUp_Global r
    -- ? 8. Join con tabla de usuarios para obtener informacion personal
    INNER JOIN Registro_Global_Usuarios u ON r.id_identidad = u.id_identidad_registro
    
    -- ? 9. Join con roles de usuario para obtener nivel de autorizacion
    INNER JOIN Roles_Users ru ON u.id_usuario = ru.id_usuario
    
    -- ? 10. Left join con brokers en caso de que el usuario sea broker
    LEFT JOIN Registro_Global_Brokers rb ON r.id_identidad = rb.id_identidad_registro
    
-- ? 11. Solo mostrar usuarios con estado activo
WHERE r.estado_actividad_registro = 'activo'

-- ? 12. Ordenar por fecha de registro mas reciente primero
ORDER BY r.fecha_registro DESC;