-- ? Actualiza broker manualmente por Global Admin
-- ? Permite cambio de informacion personal y estado del broker
-- ? Maneja asignacion y cambio de roles segun estado

create procedure actualizarBrokerManual(
    in brokerId int,
    in nombrePrim varchar(255),
    in apellidoPrim varchar(255),
    in fullNombre varchar(512),
    in telefono varchar(50),
    in fechaNacimiento date,
    in estadoBroker enum('pendiente', 'activo', 'rechazado'),
    in rolBroker enum('broker_superadmin', 'broker_admin', 'broker_analyst'),
    in adminId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables para valores anteriores
    declare oldNombre varchar(255);
    declare oldApellido varchar(255);
    declare oldFullNombre varchar(512);
    declare oldTelefono varchar(50);
    declare oldFechaNacimiento date;
    declare oldEstado varchar(50);
    declare brokerExiste int default 0;
    declare tieneRol int default 0;
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500; --  Retornamos valor base de 5xx  error del servidor
        rollback;
    end;
    
    -- ? Inicializar resultado
    set codigoResultado = 200; -- Retornamos vlaor de 2xx asumiendo que la ejecucion
    -- paso sin errores.
    
    start transaction;
    
    -- ? Verificar existencia y obtener valores actuales
    select
        nombre_prim_broker,
        apellido_prim_broker,
        full_nombre_broker,
        numero_telefono_broker,
        fecha_nacimiento_broker,
        estado_broker,
        1
    into
        oldNombre,
        oldApellido,
        oldFullNombre,
        oldTelefono,
        oldFechaNacimiento,
        oldEstado,
        brokerExiste
    from   Registro_Global_Brokers 
    where  id_broker = brokerId;
    
    -- ? Verificar si broker no existe
    if brokerExiste = 0 then
        set codigoResultado = 404; -- No obtuvimos un id de salida y por tanto no existe.
        rollback;
    else
        -- ? Actualizar informacion del broker
        update Registro_Global_Brokers 
        set
            nombre_prim_broker = nombrePrim,
            apellido_prim_broker = apellidoPrim,
            full_nombre_broker = fullNombre,
            numero_telefono_broker = telefono,
            fecha_nacimiento_broker = fechaNacimiento,
            estado_broker = estadoBroker
        where  id_broker = brokerId;
        
        -- ? Verificar si ya tiene rol asignado
        select count(*) into tieneRol
        from   Roles_Broker
        where  id_broker = brokerId;
        
        -- ? Manejar roles segun estado
        if estadoBroker = 'activo' then
            -- ? Si esta activo, asegurar que tenga rol
            if tieneRol = 0 then
                insert into Roles_Broker (id_broker, rol_broker)
                values (brokerId, rolBroker);
            else
                update Roles_Broker 
                set    rol_broker = rolBroker
                where  id_broker = brokerId;
            end if;
        elseif estadoBroker in ('pendiente', 'rechazado') and tieneRol > 0 then
            -- ? Si no esta activo, remover rol si existe. En este caso, si
            -- el broker tiene un rol, y el  estado del broker paso hacia pendiente
            -- o rechazado, entonces eliminamos el registro anterior de roles.

            -- Para el manejo de esta sentencia, usaremos la nocion en el BE API que
            -- tenemos que evitar el caso de actualizacion de la misma data del usuario aqui
            delete from Roles_Broker where id_broker = brokerId;
        end if;
        
        -- ? Registrar cambios en auditoria
        insert into RegistroAudit_AccionesBrokers (
            id_broker,
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
            brokerId,
            adminId,
            'UPDATE',
            oldNombre,
            oldApellido,
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