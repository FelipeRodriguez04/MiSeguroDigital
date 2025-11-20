-- ? Registra un nuevo pago asociado a una poliza
-- ? Valida que el registro del usuario en la poliza este activo

create procedure crearRegistroPagoPolizaPorUsuario(
    in registroPolizaId int,
    in cantidadPago decimal(10,2),
    in metodoPago enum('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'cheque', 'otro'),
    in motivoPago enum('pago_mensualidad', 'pago_importe_cancelacion'),
    out codigoResultado int,
    out nuevoPagoId int
)
begin
    -- ? Declarar variables de control
    declare registroActivoExiste int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;
    set nuevoPagoId = 0;

    start transaction;

    -- ? Validar que el registro de poliza existe y esta activo
    select
        count(*)
    into registroActivoExiste
    from   RegistroDeUsuarioEnPoliza
    where  id_registro_en_poliza = registroPolizaId
      and estado_de_registro = 'registro_activo';

    if registroActivoExiste = 0 then
        set codigoResultado = 404; --  No existe la poliza o no esta activa si existe
        -- EN este caso,no sepuede realisar modificaciones por tanto 404 not found
        -- para ser un catch-all del error
        rollback;
    else
        -- ? Insertar nuevo pago
        insert into PagosPorPoliza (
            id_registro_poliza,
            cantidad_pago,
            metodo_de_pago,
            estado_del_pago,
            motivo_del_pago,
            fecha_de_pago
        ) values (
            registroPolizaId,
            cantidadPago,
            metodoPago,
            'completado',
            motivoPago,
            now()
        );

        set nuevoPagoId = last_insert_id();

        commit;
    end if;
end;
