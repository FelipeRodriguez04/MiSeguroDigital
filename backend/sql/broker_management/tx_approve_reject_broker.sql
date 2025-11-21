-- ? Aprueba o rechaza solicitudes de broker
-- ? Cambia estado y asigna rol inicial si es aprobado
-- ? Registra quien tomo la decision en auditoria

create procedure aprobarORechazarBrokerManual(
    in brokerId int,
    in accion enum('aprobar', 'rechazar'),
    in rolInicial enum('broker_superadmin', 'broker_admin', 'broker_analyst'),
    in adminId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables de control
    declare brokerExiste int default 0;
    declare estadoActual varchar(50);
    declare nuevoEstado varchar(50);
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500; --  Enviamos error 5xx de servidor!
        rollback;
    end;
    
    -- ? Inicializar resultado
    set codigoResultado = 200; -- Asumimos que hasta este punto podemos enviar
    -- un estado 2xx!
    
    start transaction;
    
    -- ? Verificar existencia y estado actual del broker
    select estado_broker, 1
        into   estadoActual, brokerExiste
    from   Registro_Global_Brokers registro_brokers
    join Registro_SignUp_Global registro_identidad
        on registro_brokers.id_identidad_registro = registro_identidad.id_identidad
    where  registro_brokers.id_broker = brokerId
        and registro_identidad.estado_actividad_registro = 'activo';
    
    -- ? Validar existencia del broker
    if brokerExiste = 0 then
        set codigoResultado = 404;
        rollback;
    elseif estadoActual != 'pendiente' then
        set codigoResultado = 409;
        rollback;
    else
        -- ? Determinar nuevo estado segun accion
        if accion = 'aprobar' then
            set nuevoEstado = 'activo';
        else
            set nuevoEstado = 'rechazado';
        end if;
        
        -- ? Actualizar estado del broker
        update Registro_Global_Brokers 
        set    estado_broker = nuevoEstado
        where  id_broker = brokerId;
        
        -- ? Si fue aprobado, asignar rol inicial
        if accion = 'aprobar' then
            insert into Roles_Broker (
                id_broker,
                rol_broker
            ) values (
                brokerId,
                rolInicial
            );
        else
            -- Si fue denegado entonces marcamos la cuenta como desactivada en
            -- en el registro principal
            update Registro_SignUp_Global
            join Registro_Global_Brokers registro_brokers
                on registro_brokers.id_identidad_registro = Registro_SignUp_Global.id_identidad
            set Registro_SignUp_Global.estado_actividad_registro = 'inactivo'
            where registro_brokers.id_broker = brokerId;
        end if;
        
        -- ? Registrar decision en auditoria
        insert into RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            fecha_modificacion_usuario
        ) values (
            brokerId,
            adminId,
            'UPDATE',
            now()
        );
        
        commit;
    end if;
end;