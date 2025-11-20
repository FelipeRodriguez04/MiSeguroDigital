-- ? View que permite obtene rla inforamcion basica de los uuarios registrados, en este caso inclusive tenemos data de
-- ? la tabla de los brokers id unidas con un Left Join.

create or replace view viewInformacionuUsuariosBasica as
select 
    registro_usuarios.id_usuario,
    registro_identidad.correo_registro as email,
    registro_usuarios.nombre_prim_usuario,
    registro_usuarios.apellido_prim_usuario,
    registro_usuarios.full_nombre_usuario,
    registro_usuarios.numero_telefono_usuario,
    registro_usuarios.fecha_nacimiento_usuario,
    registro_identidad.estado_actividad_registro as is_active,
    registro_identidad.fecha_registro as created_at,
    roles_usuarios.rol_usuario as role_name,
    IFNULL(registro_brokers.id_broker, 'No Aplica') as broker_id,
    IFNULL(registro_brokers.estado_broker, 'No Aplica') as broker_status
from Registro_SignUp_Global registro_identidad
    join Registro_Global_Usuarios registro_usuarios
        on registro_identidad.id_identidad = registro_usuarios.id_identidad_registro
    join Roles_Users roles_usuarios
        on registro_usuarios.id_usuario = roles_usuarios.id_usuario
    left join Registro_Global_Brokers registro_brokers
        on registro_identidad.id_identidad = registro_brokers.id_identidad_registro
where registro_identidad.estado_actividad_registro = 'activo'
order by registro_identidad.fecha_registro desc;