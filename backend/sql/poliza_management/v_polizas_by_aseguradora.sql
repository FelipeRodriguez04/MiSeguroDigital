-- ? Vista para mostrar polizas agrupadas por aseguradora  lo que nos facilita el analisis
--  y retorno de datos en base de las aseguradoras,permitiendonos filtrar luego en la
-- aplicacion final

create or replace view viewPolizaInfoPorAseguradora as
select 
    -- ? Informacion de la aseguradora
    aseguradora.id_aseguradora,
    aseguradora.nombre_aseguradora,
    
    -- ? Informacion de la poliza
    polizas.id_poliza,
    polizas.nombre_de_la_poliza,
    polizas.tipo_de_poliza,
    polizas.pago_mensual,
    polizas.monto_cobertura_total,
    polizas.estado_de_poliza,
    polizas.porcentaje_de_aprobacion,
    
    -- ? Metricas de aplicaciones
    IFNULL(conteo_aplicantes_polizas.total_aplicaciones, 0) as total_aplicaciones,
    IFNULL(conteo_registros_activos_poliza.registros_activos, 0)                  as registros_activos,
    
    -- ? Indicadores de popularidad
    case 
        when IFNULL(conteo_aplicantes_polizas.total_aplicaciones, 0) > 10 then 'Alta'
        when IFNULL(conteo_aplicantes_polizas.total_aplicaciones, 0) > 5 then 'Media'
        else 'Baja'
    end                                                     as popularidad_poliza
    
from Aseguradoras aseguradora
    -- ? Join con polizas
    join PolizasDeSeguro polizas
        on aseguradora.id_aseguradora = polizas.id_aseguradora
    -- ? Left join con conteo de aplicaciones: otra vez ,los dos left join
    --  hechos son para obtener datos de aplicaciones y mantener datos si es nulo
    left join (
        select 
            id_poliza,
            count(*) as total_aplicaciones
        from AplicacionAPoliza
        group by id_poliza
    ) as conteo_aplicantes_polizas
        on polizas.id_poliza = conteo_aplicantes_polizas.id_poliza
    
    -- ? Left join con conteo de registros activos
    left join (
        select 
            id_poliza,
            count(*) as registros_activos
        from RegistroDeUsuarioEnPoliza
        where estado_de_registro = 'registro_activo'
        group by id_poliza
    ) as conteo_registros_activos_poliza
        on polizas.id_poliza = conteo_registros_activos_poliza.id_poliza

-- ? Ordenar por aseguradora y popularidad
order by 
    aseguradora.nombre_aseguradora asc;