-- ? Este procedure permite la creacion de un usuario manualmente dentro de la aplicacion.  Este mecanismo esta
-- ? disenado para ser usado por el modulo de admnistracion para crear usuarios dentro de la aplicacion. En cambio,
-- ? cuando se trate de una creacin de usuario por parte del propio modulo de sign up entonces laidea es que el ID del
-- ? admin sea el primer ID del admin con rol global_admin en el sistema.

create procedure crearUsuarioManualDesdeAdminOSignUp(
    in email varchar(255),
    in passwordHash varchar(512),
    in passwordSalt varchar(512),
    in nombrePrim varchar(255),
    in apellidoPrim varchar(255),
    in fullNombre varchar(512),
    in telefono varchar(50),
    in fechaNacimiento date,
    in rolUsuario enum('global_superadmin', 'global_admin', 'global_user'),
    in adminId int,
    in comingFrom enum('signup', 'admin'),
    out codigoResultado int,
    out nuevoUsuarioId int
)
begin
    -- ?  Declarar variables para manejo de errores y control de flujo
    declare emailCount int default 0;
    declare identityId int default 0;
    declare usuarioId int default 0;
    
    -- ?  Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;
    
    -- ?  Inicializar codigo de resultado como exitoso
    set codigoResultado = 200;
    set nuevoUsuarioId = 0;
    
    start transaction;
    
    -- ?  Verificar si el email ya existe en el sistema
    select
        count(*)
    into emailCount
    from   Registro_SignUp_Global 
    where  correo_registro = email;
    
    -- ?  Si email ya existe, retornar error de conflicto
    if emailCount > 0 then
        set codigoResultado = 409; -- En este caso bloqueamos la transaccion si el correo ya existe, esto es porque
        -- queremos garantizar que el correo de los usuarios sea unico al igual que sus usuarios.
        rollback;
    else
        -- ?  Insertar en tabla de registro principal
        insert into Registro_SignUp_Global (
            correo_registro,
            hashed_pwd_registro,
            hashed_pwd_salt_registro,
            estado_actividad_registro,
            fecha_registro
        ) values (
            email,
            passwordHash,
            passwordSalt,
            'activo',
            now()
        );
        
        -- ?  Obtener ID del registro recien creado
        set identityId = last_insert_id();
        
        -- ?  Insertar informacion del usuario
        insert into Registro_Global_Usuarios (
            id_identidad_registro,
            nombre_prim_usuario,
            apellido_prim_usuario,
            full_nombre_usuario,
            numero_telefono_usuario,
            fecha_nacimiento_usuario
        ) values (
            identityId,
            nombrePrim,
            apellidoPrim,
            fullNombre,
            telefono,
            fechaNacimiento
        );
        
        -- ?  Obtener ID del usuario recien creado
        set usuarioId = last_insert_id();
        set nuevoUsuarioId = usuarioId;
        
        -- ?  Asignar rol al usuario
        insert into Roles_Users (
            id_usuario,
            rol_usuario
        ) values (
            usuarioId,
            rolUsuario
        );

        if comingFrom = 'admin' then
            insert into RegistroAudit_AccionesUsuarios (
                id_usuario,
                id_admin_modificacion,
                operacion_realizada,
                nombre_prim_nuevo,
                apellido_prim_nuevo,
                full_nombre_nuevo,
                numero_telefono_nuevo,
                fecha_nacimiento_usuario_nuevo,
                fecha_modificacion_usuario
                )
            values (
                usuarioId,
                adminId,
                'INSERT',
                nombrePrim,
                apellidoPrim,
                fullNombre,
                telefono,
                fechaNacimiento,
                now()
            );
        elseif comingFrom = 'signup' then
            -- ? Obtenemos el id del primer admin con rol global_admin. para esto buscamos en base al rol del usuario
            -- y buscamos filtrando por el tipode global_admin. El primero de estos (asc limit 1) va a ser el que
            -- registremos como workaround
            set adminId = (
                select
                    id_usuario
                from Roles_Users
                where
                    rol_usuario = 'global_admin'
                order by
                    id_usuario
                asc
                limit 1);
            insert into RegistroAudit_AccionesUsuarios (
                id_usuario,
                id_admin_modificacion,
                operacion_realizada,
                nombre_prim_nuevo,
                apellido_prim_nuevo,
                full_nombre_nuevo,
                numero_telefono_nuevo,
                fecha_nacimiento_usuario_nuevo,
                fecha_modificacion_usuario
                )
            values (
                usuarioId,
                adminId,
                'INSERT',
                nombrePrim,
                apellidoPrim,
                fullNombre,
                telefono,
                fechaNacimiento,
                now()
            );
        end if;

        -- ? Guardamos los cambios al final
        commit;
    end if;
end;