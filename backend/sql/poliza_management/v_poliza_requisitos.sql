-- ? Vista para listar los requisitos asociados a cada poliza
-- ? Facilita la gestion de que documentos son necesarios para cada tipo de seguro

create or replace view viewRequesitosPorPolizas as
select
    -- ? Informacion de la poliza
    poliza.id_poliza,
    poliza.nombre_de_la_poliza,
    -- ? Informacion del requisito
    requerimientos_por_poliza.id_requerimiento,
    requerimientos_por_poliza.tipo_requerimiento,
    requerimientos_por_poliza.descripcion_requerimiento,
    requerimientos_por_poliza.requerimiento_obligatorio
from
    PolizasDeSeguro poliza
    -- ? Unir con la tabla de requerimientos para obtener los detalles
    inner join Requerimientos_por_Poliza requerimientos_por_poliza
        on poliza.id_poliza = requerimientos_por_poliza.id_poliza
order by
    -- ? Ordenar por nombre de poliza y luego por tipo de requerimiento
    poliza.nombre_de_la_poliza,
    requerimientos_por_poliza.tipo_requerimiento;
