-- ? Vista para mostrar los datos reducidos para accionar rapido,
-- ? esta es un tipo dashboard mas pequena que permite ver la inormacion de la poliza
-- ? con los totales simples

create or replace view viewInformacionPolizaBasica as
select 
    -- ? Campos principales de la poliza
    poliza.id_poliza,
    poliza.nombre_de_la_poliza,
    poliza.descripcion_de_la_poliza,
    poliza.tipo_de_poliza,
    poliza.pago_mensual,
    poliza.monto_cobertura_total,
    poliza.duracion_de_contrato,
    poliza.porcentaje_de_aprobacion,
    poliza.importe_por_cancelacion,
    poliza.estado_de_poliza,
    
    -- ? Informacion de la aseguradora
    aseguradora.id_aseguradora,
    aseguradora.nombre_aseguradora,
    aseguradora.dominio_correo_aseguradora,
    
    -- ? Contadores de aplicaciones
    IFNULL(estadista_aplicaciones.total_aplicaciones, 0) as total_aplicaciones,
    IFNULL(estadista_aplicaciones.aplicaciones_pendientes, 0) as aplicaciones_pendientes,
    IFNULL(estadista_aplicaciones.aplicaciones_aprobadas, 0) as aplicaciones_aprobadas
    
from PolizasDeSeguro poliza
    -- ? Join con aseguradoras
    join Aseguradoras aseguradora
        on poliza.id_aseguradora = aseguradora.id_aseguradora
    
    -- ? Left join con estadisticas de aplicaciones: tal cmo el a poliza read only
    -- usamos el left join para evitar el perder registros en el aso de que no haya
    -- aplicaciones a la poliza
    left join (
        select 
            id_poliza,
            count(*) as total_aplicaciones,
            sum(case
                when estado_actual_aplicacion = 'pendiente_procesar'
                    then 1 else 0 end) as aplicaciones_pendientes,
            sum(case
                when estado_actual_aplicacion = 'aprobada'
                    then 1 else 0 end) as aplicaciones_aprobadas
        from AplicacionAPoliza
        group by id_poliza
    ) as estadista_aplicaciones
        on poliza.id_poliza = estadista_aplicaciones.id_poliza

-- ? Ordenar por estado y nombre de poliza: este ordenamiento es complejo, y
-- es algo que he estudiado adicional a la clase y he usado en varias partes
-- del proyecto para ordenar cmo lo hariamos con un switch en Java.
order by 
    case poliza.estado_de_poliza
        when 'activa' then 1
        when 'pausada' then 2
        when 'despublicada' then 3
        else 4
    end,
    poliza.nombre_de_la_poliza asc;