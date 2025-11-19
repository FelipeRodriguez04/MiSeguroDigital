-- ? Vista optimizada para el catalogo publico de polizas, la informacion
-- ? que se obtiene aqui retorna solo la data importante para el usuario

create or replace view  viewPolizaCatalogoCompleto as
select
    -- ? Informacion basica de la poliza
    polizas.id_poliza,
    polizas.nombre_de_la_poliza,
    polizas.descripcion_de_la_poliza,
    polizas.tipo_de_poliza,
    polizas.pago_mensual,
    polizas.monto_cobertura_total,
    polizas.duracion_de_contrato,
    polizas.porcentaje_de_aprobacion,
    polizas.importe_por_cancelacion,
    -- ? Informacion de la aseguradora
    aseguradoras.nombre_aseguradora,
    -- ? Solo mostrar polizas activas
    polizas.estado_de_poliza
from
    PolizasDeSeguro polizas
    -- ? Unir con la tabla de aseguradoras para obtener el nombre
    join Aseguradoras aseguradoras
        on polizas.id_aseguradora = aseguradoras.id_aseguradora
where
    -- ? Filtrar solo las polizas que estan activas
    polizas.estado_de_poliza = 'activa'
order by
    -- ? Ordenar por tipo de poliza y luego por nombre
    polizas.tipo_de_poliza,
    polizas.nombre_de_la_poliza;
