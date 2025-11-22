-- ? Reembolsa un pago cambiando su estado a 'reembolsado'
-- ? Simula la devolucion de fondos al usuario sin eliminar el registro

create procedure reembolsarPagoPolizaPorUsuario(
    in pagoId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables de control
    declare pagoExiste int default 0;
    declare estadoActual enum('pendiente', 'completado', 'fallido', 'reembolsado');
    declare registroPolizaId int;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Validar que el pago existe y obtener su estado actual
    select
        1, estado_del_pago, id_registro_poliza
    into pagoExiste, estadoActual, registroPolizaId
    from   PagosPorPoliza
    where  id_pago = pagoId;

    if pagoExiste = 0 then
        set codigoResultado = 404; -- Pago no encontrado
        rollback;
    elseif estadoActual = 'reembolsado' then
        set codigoResultado = 409; -- Pago ya esta reembolsado
        rollback;
    elseif estadoActual != 'completado' then
        set codigoResultado = 400; -- Solo se pueden reembolsar pagos completados
        rollback;
    else
        -- ? Actualizar estado del pago a reembolsado
        update PagosPorPoliza
        set estado_del_pago = 'reembolsado'
        where id_pago = pagoId;

        commit;
    end if;
end;