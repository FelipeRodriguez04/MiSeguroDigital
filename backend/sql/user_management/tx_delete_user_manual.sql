-- ?  Stored procedure para eliminar un usuario manualmente
-- ? permitido solo desde el modulo de administracion

create procedure eliminarUnUsuarioAdminOnlyManual(
    in usuarioId int,
    in adminId int,
    out codigoResultado int
)
begin
    -- ?  Declarar variables para validaciones y control
    declare usuarioExiste int default 0;
    declare rolUsuario varchar(50);
    declare globalAdminCount int default 0;
    
    -- ?  handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500; -- Marcamos el error general catch-all como 5xx
        rollback;
    end;
    
    -- ?  Inicializar codigo de resultado como exitoso
    set codigoResultado = 200; -- marcamos como el retorno general catch-all como 2xx
    
    start transaction;
    
    -- ?  Verificar si el usuario existe y obtener su rol
    select
        roles_usuarios.rol_usuario,
        1
    into
        rolUsuario,
        usuarioExiste
    from Registro_Global_Usuarios registro_usuarios
    join Roles_Users roles_usuarios
        on registro_usuarios.id_usuario = roles_usuarios.id_usuario
    join Registro_SignUp_Global registro_identidad
        on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
    where  registro_usuarios.id_usuario = usuarioId
      and registro_identidad.estado_actividad_registro = 'activo';
    
    -- ?  Si usuario no existe o ya esta inactivo, retornar error
    if usuarioExiste = 0 then
        set codigoResultado = 404; -- En este caso la query anteiror va a buscar en base al id del usuario que cumpla con
        -- 1. existir y dos teneor un estado activo. En el caso de que no exista entonces no va a registrar nada y el
        -- select va a estar vacio. Si el select esta vacio entonces usuarioExistete se mantiene con su base de 0. En ese
        -- caso entonces no distinguimos sobre el estado, solo retornamos un 404.
        rollback;
    else
        -- ?  Si es Global Admin, verificar que no sea el ultimo
        if rolUsuario in ('global_superadmin', 'global_admin') then
            select
                count(*)
            into globalAdminCount
            from Registro_Global_Usuarios registro_usuarios
            join Roles_Users roles_usuarios
                on registro_usuarios.id_usuario = roles_usuarios.id_usuario
            join Registro_SignUp_Global registro_identidad
                on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
            where
                roles_usuarios.rol_usuario in ('global_superadmin', 'global_admin')
            and
                registro_identidad.estado_actividad_registro = 'activo'
            and
                registro_usuarios.id_usuario <> usuarioId;
            
            -- ?  Si es el ultimo Global Admin, no permitir eliminacion
            if globalAdminCount = 0 then
                set codigoResultado = 403; -- En este caso la query anterior busca todos los que no tengan un ID
                -- igual al usuario que se esta intentando eliminar. En el caso de que tengan un id igual, entoncesw
                -- al final no lo va a realizar porque seria que no existen mas administradores globales. Esto no es
                -- permitido porque dejaria sin acceso a esas cuentas de administracion.
                rollback;
            end if;
        end if;
        
        -- ?  Si las validaciones pasaron, proceder con soft delete
        if codigoResultado = 200 then
            -- ?  Marcar registro como inactivo (soft delete)
            update Registro_SignUp_Global registro_identidad
            join Registro_Global_Usuarios registro_usuarios
                on registro_identidad.id_identidad = registro_usuarios.id_identidad_registro
            set
                registro_identidad.estado_actividad_registro = 'inactivo'
            where
                registro_usuarios.id_usuario = usuarioId;
            
            -- ?  Registrar eliminacion en auditoria
            insert into RegistroAudit_AccionesUsuarios (
                id_usuario,
                id_admin_modificacion,
                operacion_realizada,
                fecha_modificacion_usuario
            ) values (
                usuarioId,
                adminId,
                'DELETE',
                now()
            );
            
            commit;
        end if;
    end if;
end;