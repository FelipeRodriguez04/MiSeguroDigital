-- ? Elimina completamente un pago de la base de datos
-- ? Solo permite eliminar pagos en estado 'reembolsado' o 'fallido'

create procedure eliminarPagoPolizaPorUsuario(
    in pagoId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables de control
    declare pagoExiste int default 0;
    declare estadoActual enum('pendiente', 'completado', 'fallido', 'reembolsado');
    declare registroPolizaId int;
    declare cantidadPago decimal(10,2);
    declare metodoPago enum('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'cheque', 'otro');

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Validar que el pago existe y obtener sus datos
    select
        1, estado_del_pago, id_registro_poliza, cantidad_pago, metodo_de_pago
    into pagoExiste, estadoActual, registroPolizaId, cantidadPago, metodoPago
    from   PagosPorPoliza
    where  id_pago = pagoId;

    if pagoExiste = 0 then
        set codigoResultado = 404; -- Pago no encontrado
        rollback;
    elseif estadoActual = 'completado' then
        set codigoResultado = 409; -- No se puede eliminar un pago completado, debe reembolsarse primero
        rollback;
    else
        -- ? Eliminar el pago
        delete from PagosPorPoliza
        where id_pago = pagoId;

        commit;
    end if;
end;