-- ? Vista para generar estadisticas de solicitudes para los reportes del broker
-- ? Calcula el total de solicitudes aprobadas, rechazadas y pendientes

create or replace view viewEstadisticasDeSolicitudesReporteParaBrokers as
select
    -- ? Agrupar por aseguradora para reportes especificos del broker
    poliza.id_aseguradora,
    aseguradora.nombre_aseguradora,
    -- ? Contar el total de aplicaciones
    count(aplicacionPoliza.id_aplicacion_poliza) as total_aplicaciones,
    -- ? Contar las aplicaciones pendientes
    sum(case
        when aplicacionPoliza.estado_actual_aplicacion = 'pendiente_procesar'
            then 1 else 0 end) as aplicaciones_pendientes,
    -- ? Contar las aplicaciones aprobadas
    sum(case
        when aplicacionPoliza.estado_actual_aplicacion = 'aprobada'
            then 1 else 0 end) as aplicaciones_aprobadas,
    -- ? Contar las aplicaciones rechazadas
    sum(case
        when aplicacionPoliza.estado_actual_aplicacion = 'rechazada'
            then 1 else 0 end) as aplicaciones_rechazadas
from
    AplicacionAPoliza aplicacionPoliza
    -- ? Unir con polizas para poder agrupar por aseguradora
    join PolizasDeSeguro poliza
        on aplicacionPoliza.id_poliza = poliza.id_poliza
    join Aseguradoras aseguradora
        on poliza.id_aseguradora = aseguradora.id_aseguradora
group by
    -- ? Agrupar los conteos por aseguradora
    poliza.id_aseguradora;
