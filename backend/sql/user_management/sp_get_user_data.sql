-- ? Stored Procedure usado para obtener la informacion de usuario basado en un id de usuario

create procedure getUserDataByUserID(
    in UserId int,
    out ResultCode int
)
begin
    -- ? Variables de control
    declare UserExists int default 0;
    declare ExitHandlerCalled boolean default false;

    -- ? Handler para capturar errores SQL
    declare exit handler for sqlexception
    begin
        set ExitHandlerCalled = true;
        set ResultCode = 500;
    end;

    -- ?  Inicializar codigo de resultado
    set ResultCode = 200;

    -- ? Verificar si el usuario existe
    select
        count(*)
    into UserExists
    from Registro_Global_Usuarios registro_usuarios
    join Registro_SignUp_Global registro_global
        on registro_usuarios.id_identidad_registro = registro_global.id_identidad
    where registro_usuarios.id_usuario = UserId
        and registro_global.estado_actividad_registro = 'activo';

    -- ? 8. Si usuario no existe, retornar error
    if UserExists = 0 then
        set ResultCode = 404;
        select 'Usuario no encontrado' as mensaje;
    else
        -- ? 9. Retornar datos del usuario
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
            roles_usuarios.rol_usuario as role_name
        from Registro_Global_Usuarios registro_usuarios
        join Registro_SignUp_Global registro_identidad
            on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
        join Roles_Users roles_usuarios
            on registro_usuarios.id_usuario = roles_usuarios.id_usuario
        where registro_usuarios.id_usuario = UserId;
    end if;
end;