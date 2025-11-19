-- ? Obtiene el historial de pagos de un usuario para una poliza registrada
-- ? Devuelve todos los pagos asociados a un registro de poliza

create procedure obtenerPagosRealizadosPorUsuario(
    in registroPolizaId int
)
begin
    -- ? Seleccionar todos los pagos para el registro de poliza especificado
    select
        id_pago,
        cantidad_pago,
        metodo_de_pago,
        estado_del_pago,
        motivo_del_pago,
        fecha_de_pago
    from
        PagosPorPoliza
    where
        id_registro_poliza = registroPolizaId
    order by
        fecha_de_pago desc;
end;
