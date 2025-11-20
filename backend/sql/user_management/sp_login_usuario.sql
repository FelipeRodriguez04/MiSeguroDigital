    -- ? Procedure para autenticar usuario con email y password hash
    create procedure loginUsuario(
        in email varchar(255),
        in passwordHash varchar(512),
        out codigoResultado int,
        out usuarioData json
    )
    begin
        -- ? Declarar variables
        declare usuarioCount int default 0;
        declare storedSalt varchar(512);
        declare storedHash varchar(512);
        declare usuarioInfo json default JSON_OBJECT();

        -- ? Handler de errores SQL
        declare exit handler for sqlexception
        begin
            set codigoResultado = 500;
            set usuarioData = null;
        end;

        -- ? Inicializar codigo de resultado
        set codigoResultado = 401;
        set usuarioData = null;

        -- ? Verificar si el usuario existe y esta activo
        -- OJO esta primera verificacion busca encontrar el usuario dentro de los usuarios normales
        -- por lo que si el usuario aparece enla tabla de registros principales vamos a buscar que tenga un registro
        -- activo en los usuarios primero
        select
            count(*),
            registro_identidad.hashed_pwd_salt_registro,
            registro_identidad.hashed_pwd_registro
        into
            usuarioCount,
            storedSalt,
            storedHash
        from Registro_SignUp_Global registro_identidad
        where registro_identidad.correo_registro = email
        and registro_identidad.estado_actividad_registro = 'activo';

        -- ? Si usuario existe, verificar password
        if usuarioCount > 0 and storedHash = passwordHash then
                select json_object(
                    'id_usuario', registro_usuarios.id_usuario,
                    'full_nombre_usuario', registro_usuarios.full_nombre_usuario,
                    'rol_usuario', roles_usuarios.rol_usuario,
                    'correo_registro', registro_identidad.correo_registro,
                    'nombre_prim_usuario', registro_usuarios.nombre_prim_usuario,
                    'apellido_prim_usuario', registro_usuarios.apellido_prim_usuario,
                    'numero_telefono_usuario', registro_usuarios.numero_telefono_usuario
                )
                into usuarioInfo
                from Registro_SignUp_Global registro_identidad
                join Registro_Global_Usuarios registro_usuarios on registro_identidad.id_identidad = registro_usuarios.id_identidad_registro
                join Roles_Users roles_usuarios on registro_usuarios.id_usuario = roles_usuarios.id_usuario
                where registro_identidad.correo_registro = email;

                if usuarioInfo is not null then
                    set codigoResultado = 200;
                    set usuarioData = usuarioInfo;
                else
                    -- Ahora buscamos en el otro lado, buscamos si tal vez no es un usuario sino un broker
                    select json_object(
                        'id_broker', registro_brokers.id_broker,
                        'full_nombre_broker', registro_brokers.full_nombre_broker,
                        'rol_usuario', roles_broker.rol_broker,
                        'correo_registro', registro_identidad.correo_registro,
                        'nombre_prim_broker', registro_brokers.nombre_prim_broker,
                        'apellido_prim_broker', registro_brokers.apellido_prim_broker,
                        'numero_telefono_broker', registro_brokers.numero_telefono_broker
                        'estado_broker', registro_brokers.estado_broker
                    )
                    into usuarioInfo
                    from Registro_SignUp_Global registro_identidad
                    join Registro_Global_Brokers registro_brokers
                        on registro_identidad.id_identidad = registro_brokers.id_identidad_registro
                    left join roles_broker
                        on registro_brokers.id_broker = roles_broker.id_broker
                    where registro_identidad.correo_registro = email;
                    
                    if usuarioInfo is not null then
                        set codigoResultado = 200;
                        set usuarioData = usuarioInfo;
                    end if;
                end if;
        end if;
    end;