-- ? Vista generada para la rapida visualizacion de la data de los usuarios en el panel de administracion
-- ? en este caso la informaciona agurpa todos los tipos de usaurios, por lo que se agrupa incluyendo los posibles
-- ? roles de los brokers

create or replace view usuarios_por_rol_view as
select 
    -- ? Informacion del rol
    roles_usuario.rol_usuario as role_name,
    -- ? Informacion basica del usuario
    registro_usuarios.id_usuario,
    registro_identidad.correo_registro as email,
    registro_usuarios.nombre_prim_usuario,
    registro_usuarios.apellido_prim_usuario,
    registro_usuarios.full_nombre_usuario,
    registro_usuarios.numero_telefono_usuario,
    -- ? Estado y fechas
    registro_identidad.estado_actividad_registro as is_active,
    registro_identidad.fecha_registro as created_at
    
from Registro_SignUp_Global registro_identidad
    join Registro_Global_Usuarios registro_usuarios
        on registro_identidad.id_identidad = registro_usuarios.id_identidad_registro
    join Roles_Users roles_usuario
        on registro_usuarios.id_usuario = roles_usuario.id_usuario
-- ? Solo mostrar usuarios activos
where registro_identidad.estado_actividad_registro = 'activo'
-- ? Ordenar por rol y luego por fecha de registro
order by 
    case roles_usuario.rol_usuario
        when 'global_superadmin' then 1
        when 'global_admin' then 2
        when 'global_user' then 3
        else 4
    end;