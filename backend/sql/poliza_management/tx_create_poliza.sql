-- ? Crea poliza por Admin Broker
-- ? Valida aseguradora y crea registro con auditoria
-- ? Solo admins pueden crear polizas nuevas

create procedure crearPolizaPorBrokerAdmin(
    in aseguradoraId int,
    in nombrePoliza varchar(255),
    in descripcion text,
    in tipoPoliza enum('seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud'),
    in pagoMensual decimal(10,2),
    in montoCobertura decimal(15,2),
    in duracionContrato int,
    in porcentajeAprobacion decimal(5,2),
    in importeCancelacion decimal(10,2),
    in estadoInicial enum('activa', 'pausada', 'despublicada'),
    in brokerId int,
    out codigoResultado int,
    out nuevaPolizaId int
)
begin
    -- ? Declarar variables de control
    declare aseguradoraExiste int default 0;
    declare polizaId int default 0;
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;
    
    -- ? Inicializar resultados, definimos el codigo de resutado genrralmente as 2xx, en este caso 200 para indicar
    --  estado OK en la respuesta de la API.
    set codigoResultado = 200;
    set nuevaPolizaId = 0;
    
    start transaction;
    
    -- ? Verificar que aseguradora existe
    select
        count(*)
    into aseguradoraExiste
    from   Aseguradoras
    where  id_aseguradora = aseguradoraId;
    
    -- ? Validar aseguradora existe
    if aseguradoraExiste = 0 then
        set codigoResultado = 404; -- Si no existe la aseguradora, entonces tenemos el registro como cero,porque
        -- el select va areotrnar nada. Entonces, al final retornamos 404 para un catch-all de no encontrar la aseguradora
        rollback;
    else
        -- ? Crear la poliza
        insert into PolizasDeSeguro (
            id_aseguradora,
            nombre_de_la_poliza,
            descripcion_de_la_poliza,
            tipo_de_poliza,
            pago_mensual,
            monto_cobertura_total,
            duracion_de_contrato,
            porcentaje_de_aprobacion,
            importe_por_cancelacion,
            estado_de_poliza
        ) values (
            aseguradoraId,
            nombrePoliza,
            descripcion,
            tipoPoliza,
            pagoMensual,
            montoCobertura,
            duracionContrato,
            porcentajeAprobacion,
            importeCancelacion,
            estadoInicial
        );
        
        set polizaId = last_insert_id();
        set nuevaPolizaId = polizaId;
        
        -- ? Registrar creacion en auditoria
        insert into RegistroAudit_Polizas (
            operacion_realizada,
            id_poliza,
            id_aseguradora,
            nuevo_nombre_poliza,
            cambios_por_broker_id,
            fecha_de_modificacion
        ) values (
            'INSERT',
            polizaId,
            aseguradoraId,
            nombrePoliza,
            brokerId,
            now()
        );
        
        commit;
    end if;
end;