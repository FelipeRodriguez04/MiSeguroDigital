-- ? Crea broker manualmente por Global Admin
-- ? Incluye validaciones de email unico y aseguradora valida
-- ? Crea regfstro completo y asigna rol inicial

create procedure crearBrokerManual(
    in email varchar(255),
    in passwordHash varchar(512),
    in passwordSalt varchar(512),
    in nombrePrim varchar(255),
    in apellidoPrim varchar(255),
    in fullNombre varchar(512),
    in telefono varchar(50),
    in fechaNacimiento date,
    in aseguradoraId int,
    in estadoInicial enum('pendiente', 'activo', 'rechazado'),
    in rolInicial enum('broker_superadmin', 'broker_admin', 'broker_analyst'),
    in adminId int,
    out codigoResultado int,
    out nuevoBrokerId int
)
begin
    -- ? Declarar variables para control de flujo
    declare emailCount int default 0;
    declare aseguradoraExiste int default 0;
    declare identityId int default 0;
    declare brokerId int default 0;
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;
    
    -- ? Inicializar resultados
    set codigoResultado = 200;
    set nuevoBrokerId = 0;
    
    start transaction;
    
    -- ? Verificar email unico
    select count(*) into emailCount 
    from   Registro_SignUp_Global 
    where  correo_registro = email;
    
    -- ? Verificar que aseguradora existe
    select count(*) into aseguradoraExiste
    from   Aseguradoras
    where  id_aseguradora = aseguradoraId;
    
    -- ? Validar email unico
    if emailCount > 0 then
        set codigoResultado = 409;   -- ?   Correo de registro ya existe
        rollback;
    elseif aseguradoraExiste = 0 then
        set codigoResultado = 404; -- ? Aseguradora no existe
        rollback;
    else
        -- ? Crear registro principal
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
        
        set identityId = last_insert_id();
        
        -- ? Crear registro de broker
        insert into Registro_Global_Brokers (
            id_identidad_registro,
            id_aseguradora,
            nombre_prim_broker,
            apellido_prim_broker,
            full_nombre_broker,
            numero_telefono_broker,
            fecha_nacimiento_broker,
            estado_broker
        ) values (
            identityId,
            aseguradoraId,
            nombrePrim,
            apellidoPrim,
            fullNombre,
            telefono,
            fechaNacimiento,
            estadoInicial
        );
        
        set brokerId = last_insert_id();
        set nuevoBrokerId = brokerId;
        
        -- ? Asignar rol si el estado es activo
        if estadoInicial = 'activo' then
            insert into Roles_Broker (
                id_broker,
                rol_broker
            ) values (
                brokerId,
                rolInicial
            );
        end if;
        
        -- ? Registrar en auditoria
        insert into RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            nombre_prim_nuevo,
            apellido_prim_nuevo,
            full_nombre_nuevo,
            numero_telefono_nuevo,
            fecha_nacimiento_usuario_nuevo,
            fecha_modificacion_usuario
        ) values (
            brokerId,
            adminId,
            'INSERT',
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