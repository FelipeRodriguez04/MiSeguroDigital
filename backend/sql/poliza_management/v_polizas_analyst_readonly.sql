-- ? Vista de solo lectura para analistas de broker que muestra la informacino esencial de
-- ?  las polizas incluyendo metricas para el analisis de datos


create or replace view viewPolizasBrokerAnalista as
select
    -- ? Informacion basica de la poliza
    polizas.id_poliza,
    polizas.nombre_de_la_poliza,
    polizas.descripcion_de_la_poliza,
    polizas.tipo_de_poliza,
    polizas.pago_mensual,
    polizas.monto_cobertura_total,
    polizas.duracion_de_contrato,
    polizas.estado_de_poliza,

    -- ? Informacion de aseguradora (solo nombre)
    aseguradoras.nombre_aseguradora,

    -- ? Metricas de aplicaciones para analisis
    IFNULL(estadista_aplicaciones.total_aplicaciones, 0) as total_aplicaciones,
    IFNULL(estadista_aplicaciones.aplicaciones_pendientes, 0) as aplicaciones_pendientes,
    IFNULL(estadista_aplicaciones.aplicaciones_aprobadas, 0) as aplicaciones_aprobadas,
    IFNULL(estadista_aplicaciones.aplicaciones_rechazadas, 0) as aplicaciones_rechazadas,

    -- ? Tasa de aprobacion calculada
    case
        when coalesce(estadista_aplicaciones.total_aplicaciones, 0) > 0 then
            round((coalesce(estadista_aplicaciones.aplicaciones_aprobadas, 0) * 100.0) / estadista_aplicaciones.total_aplicaciones, 2)
        else 0
    end as tasa_aprobacion_real,

    -- ? Registros activos actuales
    coalesce(estadista_registro.registros_activos, 0) as registros_activos_actuales

from PolizasDeSeguro polizas
    -- ? Join con aseguradoras
    join Aseguradoras aseguradoras
        on polizas.id_aseguradora = aseguradoras.id_aseguradora
    -- ? Left join con estadisticas de aplicaciones, en este caso, como vamos a hacer
    -- ? un analisis interno de datos con especto de las aprobaciones, puede haber el caso
    -- ? en el que no exista un registro de aplicaciones, pero si exista la poliza,tal vez es una
    -- ? mala poliza, en est caso, la informacion de la poliza debe existir, pero
    -- ? la info del otro lado saldra como null para no perder registros
    left join (
        select
            id_poliza,
            count(*) as total_aplicaciones,
            -- Suma inline que me dijo Claude para contar los pendientes, aprobadors
            -- y rechazados y sacar numeros  para estadistica.
            sum(case
                when estado_actual_aplicacion = 'pendiente_procesar'
                    then 1 else 0 end) as aplicaciones_pendientes,
            sum(case
                when estado_actual_aplicacion = 'aprobada'
                    then 1 else 0 end) as aplicaciones_aprobadas,
            sum(case
                when estado_actual_aplicacion = 'rechazada'
                    then 1 else 0 end) as aplicaciones_rechazadas
        from AplicacionAPoliza
        group by id_poliza
    ) as estadista_aplicaciones
        on polizas.id_poliza = estadista_aplicaciones.id_poliza

    -- ? Left join con registros activos: en este caso hacemos lo mismo
    -- ?  usamos left join para evitar el caso de perder registros en el que
    -- ? exista la poliza pero no existan registros de aplicaciones
    left join (
        select
            id_poliza,
            count(*) as registros_activos
        from RegistroDeUsuarioEnPoliza
        where estado_de_registro = 'registro_activo'
        group by id_poliza
    ) as  estadista_registro
        on polizas.id_poliza = estadista_registro.id_poliza

-- ? Solo polizas activas y pausadas para analistas
where polizas.estado_de_poliza in ('activa', 'pausada')

-- ? Ordenar por popularidad y nombre
order by
    IFNULL(estadista_aplicaciones.total_aplicaciones, 0) desc,
    polizas.nombre_de_la_poliza asc;