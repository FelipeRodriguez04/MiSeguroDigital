-- ? Permite que un analista apruebe o rechace una solicitud de poliza
-- ? Cambia el estado de la aplicacion y registra la decision en auditoria

create procedure procesarAplicacionEnPolizaPorUsuario(
    in aplicacionId int,
    in brokerAnalistaId int,
    in decision enum('aprobada', 'rechazada'),
    in razonRechazo text,
    out codigoResultado int
)
begin
    -- ? Declarar variables para datos de la aplicacion
    declare estadoActual enum('pendiente_procesar', 'aprobada', 'rechazada');
    declare usuarioId int;
    declare polizaId int;

    -- ? Handler  de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500; -- Declara un exit handler con error code 500
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200; -- Asumimos que ess posible retornar 200 como codigo

    start transaction;

    -- ? Verificar existencia de aplicacion y obtener datos actuales
    select estado_actual_aplicacion, id_usuario, id_poliza
    into   estadoActual, usuarioId, polizaId
    from   AplicacionAPoliza
    where  id_aplicacion_poliza = aplicacionId;

    -- ? Validar que la aplicacion existe y esta pendiente
    if usuarioId is null then
        set codigoResultado = 404; -- No se ha encontrado un rgistro basado en el Id de Aplicacion  (stale data?)
        rollback;
    elseif estadoActual != 'pendiente_procesar' then
        set codigoResultado = 409; -- Si ya no es pendiente procesar no es necesario procesar de nuevo
        rollback;
    else
        -- ? Actualizar estado de la aplicacion
        update AplicacionAPoliza
        set    estado_actual_aplicacion = decision,
               id_broker_que_reviso = brokerAnalistaId,
               razon_de_rechazo = razonRechazo
        where  id_aplicacion_poliza = aplicacionId;

        -- ? Registrar decision en auditoria
        insert into RegistroAudit_EstadoAplicacionPoliza (
            id_aplicacion_poliza,
            id_usuario,
            id_poliza,
            id_broker_modificador,
            estado_aplicacion_antiguo,
            razon_rechazo_broker_antigua,
            fecha_de_modificacion
        ) values (
            aplicacionId,
            usuarioId,
            polizaId,
            brokerAnalistaId,
            estadoActual,
            razonRechazo,
            now()
        );

        commit;
    end if;
end;
