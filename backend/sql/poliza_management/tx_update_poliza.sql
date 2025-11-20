-- ? Actualiza poliza por Admin Broker
-- ? Registra valores anteriores y nuevos en auditoria
-- ? Valida existencia de poliza antes de actualizar

create procedure actualizarPolizaPorAdmin(
    in polizaId int,
    in nombrePoliza varchar(255),
    in descripcion text,
    in tipoPoliza enum('seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud'),
    in pagoMensual decimal(10,2),
    in montoCobertura decimal(15,2),
    in duracionContrato int,
    in porcentajeAprobacion decimal(5,2),
    in importeCancelacion decimal(10,2),
    in estadoPoliza enum('activa', 'pausada', 'despublicada'),
    in brokerId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables para valores anteriores
    declare oldNombre varchar(255);
    declare oldDescripcion text;
    declare oldPagoMensual decimal(10,2);
    declare oldEstado varchar(50);
    declare oldMontoCobertura decimal(15,2);
    declare oldDuracion int;
    declare oldPorcentaje decimal(5,2);
    declare oldImporte decimal(10,2);
    declare aseguradoraId int;
    declare polizaExiste int default 0;
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;
    
    -- ? Inicializar resultado
    set codigoResultado = 200;
    
    start transaction;
    
    -- ? Verificar existencia y obtener valores actuales
    select
        nombre_de_la_poliza,
        descripcion_de_la_poliza,
        pago_mensual,
        estado_de_poliza,
        monto_cobertura_total,
        duracion_de_contrato,
        porcentaje_de_aprobacion,
        importe_por_cancelacion,
        id_aseguradora,
        1
    into
        oldNombre,
        oldDescripcion,
        oldPagoMensual,
        oldEstado,
        oldMontoCobertura,
        oldDuracion,
        oldPorcentaje,
        oldImporte,
        aseguradoraId,
        polizaExiste
    from   PolizasDeSeguro 
    where  id_poliza = polizaId;
    
    -- ? Validar existencia de poliza
    if polizaExiste = 0 then
        set codigoResultado = 404; -- Si no encontramos la poliza al seleccionar sus componentes, es decir
        -- el valor de polizaExiste escero entonces retornamos directamente un 404 y hacemos un rollback
        rollback;
    else
        -- ? Actualizar la poliza
        update PolizasDeSeguro 
        set    nombre_de_la_poliza = nombrePoliza,
               descripcion_de_la_poliza = descripcion,
               tipo_de_poliza = tipoPoliza,
               pago_mensual = pagoMensual,
               monto_cobertura_total = montoCobertura,
               duracion_de_contrato = duracionContrato,
               porcentaje_de_aprobacion = porcentajeAprobacion,
               importe_por_cancelacion = importeCancelacion,
               estado_de_poliza = estadoPoliza
        where  id_poliza = polizaId;
        
        -- ? Registrar cambios en auditoria
        insert into RegistroAudit_Polizas (
            operacion_realizada,
            id_poliza,
            id_aseguradora,
            antiguo_nombre_poliza,
            nuevo_nombre_poliza,
            antiguo_descripcion_poliza,
            antiguo_pago_mensual,
            antiguo_estatus_poliza,
            antiguo_monto_cobertura_total,
            antiguo_porcentaje_aprobacion,
            antiguo_importe_por_cancelacion,
            cambios_por_broker_id,
            fecha_de_modificacion
        ) values (
            'UPDATE',
            polizaId,
            aseguradoraId,
            oldNombre,
            nombrePoliza,
            oldDescripcion,
            oldPagoMensual,
            oldEstado,
            oldMontoCobertura,
            oldPorcentaje,
            oldImporte,
            brokerId,
            now()
        );
        
        commit;
    end if;
end;