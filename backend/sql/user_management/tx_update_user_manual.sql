-- ? Stored proicecure que permite actualizar un usuario, sea desde el modulo de administracion
-- ? o desde el modulo de usuarios para que el mismo pueda cambiar sus datos. En este caso, estos se
-- ? diferencian en que van a tener nua marca comingFrom y en base a esta se espera guardar un iD de admin
-- ? diferente.

create procedure actualizarUnUsuarioDesdeAdminOUsuario(
    in usuarioId int,
    in nombrePrim varchar(255),
    in apellidoPrim varchar(255),
    in fullNombre varchar(512),
    in telefono varchar(50),
    in fechaNacimiento date,
    in rolUsuario enum('global_superadmin', 'global_admin', 'global_user'),
    in comingFrom enum('admin', 'user'),
    in adminId int,
    out codigoResultado int
)
begin
    -- ?Declarar variables para almacenar valores anteriores
    declare oldNombrePrim varchar(255);
    declare oldApellidoPrim varchar(255);
    declare oldFullNombre varchar(512);
    declare oldTelefono varchar(50);
    declare oldFechaNacimiento date;
    declare usuarioExiste int default 0;
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;
    
    -- ? Inicializar codigo de resultado como exitoso
    set codigoResultado = 200;
    
    start transaction;
    
    -- ? Verificar si el usuario existe y obtener valores actuales
    select
        nombre_prim_usuario,
        apellido_prim_usuario,
        full_nombre_usuario,
        numero_telefono_usuario,
        fecha_nacimiento_usuario,
        1
    into
        oldNombrePrim,
        oldApellidoPrim,
        oldFullNombre,
        oldTelefono,
        oldFechaNacimiento,
        usuarioExiste
    from Registro_Global_Usuarios
    where
        id_usuario = usuarioId;
    
    -- ? Si usuario no existe, retornar error
    if usuarioExiste = 0 then
        set codigoResultado = 404; -- En el caso de que la query anterior falle (no retorne nada), entonces sabemos
        -- que el problema general es que no hay dad asociada con ese usuario en la tabla de registro de usuarios
        -- si bien ester mecanismo es defensivo, se espera que si se llega a esta zona, no se pueda cometer ese error.
        rollback;
    else
        -- ? Si usuario existe, actualizar campos basicos
        update Registro_Global_Usuarios 
        set
            nombre_prim_usuario = nombrePrim,
            apellido_prim_usuario = apellidoPrim,
            full_nombre_usuario = fullNombre,
            numero_telefono_usuario = telefono,
            fecha_nacimiento_usuario = fechaNacimiento
        where
            id_usuario = usuarioId;
        
        -- ? Actualizar rol del usuario solo si viene desde admin
        if comingFrom = 'admin' then
            update Roles_Users 
            set
                rol_usuario = rolUsuario
            where
                id_usuario = usuarioId;
        end if;
        
        -- ?Registrar cambios en auditoria
        insert into RegistroAudit_AccionesUsuarios (
            id_usuario,
            id_admin_modificacion,
            operacion_realizada,
            nombre_prim_antiguo,
            apellido_prim_antiguo,
            full_nombre_usuario_antiguo,
            numero_telefono_antiguo,
            fecha_nacimiento_usuario_antiguo,
            nombre_prim_nuevo,
            apellido_prim_nuevo,
            full_nombre_nuevo,
            numero_telefono_nuevo,
            fecha_nacimiento_usuario_nuevo,
            fecha_modificacion_usuario
        ) values (
            usuarioId,
            adminId,
            'UPDATE',
            oldNombrePrim,
            oldApellidoPrim,
            oldFullNombre,
            oldTelefono,
            oldFechaNacimiento,
            nombrePrim,
            apellidoPrim,
            fullNombre,
            telefono,
            fechaNacimiento,
            now()
        );
        commit;
    end if;
end;