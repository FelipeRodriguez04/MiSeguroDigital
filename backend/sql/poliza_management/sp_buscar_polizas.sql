-- ? Procedimientos para buscar polizas por diferentes criterios
-- ? Permite buscar por aseguradora, tipo de poliza y nombre con coincidencias parciales
-- ? En esta implementacion, la idea es usar procedures para que la busqueda no tenga un retorno
-- ? sino solo ejecute un wrapper alredeodr de una  consulta estandar para poder retornar un
-- ? result set completo.

-- ? Busca polizas registradas para una aseguradora especifica
create procedure buscarPolizaPorAseguradora(
    in aseguradoraId int
)
begin
    select
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
        aseguradora.nombre_aseguradora,
        aseguradora.dominio_correo_aseguradora
    from   PolizasDeSeguro poliza
    join Aseguradoras aseguradora
        on poliza.id_aseguradora = aseguradora.id_aseguradora
    where  poliza.id_aseguradora = aseguradoraId
    order by poliza.nombre_de_la_poliza asc;
end;

-- ? Busca polizas por tipo especifico
create procedure buscarPolizaPorTipo(
    in tipoPoliza enum('seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud')
)
begin
    select
        polizas.id_poliza,
        polizas.nombre_de_la_poliza,
        polizas.descripcion_de_la_poliza,
        polizas.tipo_de_poliza,
        polizas.pago_mensual,
        polizas.monto_cobertura_total,
        polizas.duracion_de_contrato,
        polizas.porcentaje_de_aprobacion,
        polizas.importe_por_cancelacion,
        polizas.estado_de_poliza,
        aseguradoras.nombre_aseguradora,
        aseguradoras.dominio_correo_aseguradora
    from PolizasDeSeguro polizas
    join Aseguradoras aseguradoras
        on polizas.id_aseguradora = aseguradoras.id_aseguradora
    where polizas.tipo_de_poliza = tipoPoliza
    order by polizas.nombre_de_la_poliza asc;
end;

-- ? Busca polizas por nombre usando coincidencias parciales con LIKE
create procedure buscarPolizaPorNombreParcial(
    in nombreBusqueda varchar(255)
)
begin
    select
        polizas.id_poliza,
        polizas.nombre_de_la_poliza,
        polizas.descripcion_de_la_poliza,
        polizas.tipo_de_poliza,
        polizas.pago_mensual,
        polizas.monto_cobertura_total,
        polizas.duracion_de_contrato,
        polizas.porcentaje_de_aprobacion,
        polizas.importe_por_cancelacion,
        polizas.estado_de_poliza,
        aseguradora.nombre_aseguradora,
        aseguradora.dominio_correo_aseguradora
    from   PolizasDeSeguro polizas
    inner join Aseguradoras aseguradora on polizas.id_aseguradora = aseguradora.id_aseguradora
    where  polizas.nombre_de_la_poliza like concat('%', nombreBusqueda, '%')
    order by polizas.nombre_de_la_poliza asc;
end;