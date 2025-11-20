-- ? Vista para ver los detalles completos de una solicitud
-- ? Incluye informacion del usuario, de la poliza y de los documentos/requisitos

create or replace view viewDetallesDeAplicacionPorUsuarios as
select
    -- ? Informacion de la aplicacion
    polizaAplicacion.id_aplicacion_poliza,
    polizaAplicacion.fecha_de_aplicacion,
    polizaAplicacion.estado_actual_aplicacion,
    -- ? Informacion del usuario
    registro_usuarios.id_usuario,
    registro_usuarios.full_nombre_usuario,
    registro_identidad.correo_registro,
    registro_usuarios.numero_telefono_usuario,
    registro_usuarios.fecha_nacimiento_usuario,
    -- ? Informacion de la poliza
    polizas.id_poliza,
    polizas.nombre_de_la_poliza,
    polizas.descripcion_de_la_poliza,
    polizas.pago_mensual,
    polizas.monto_cobertura_total,
    -- ? Informacion de la aseguradora
    aseguradoras.nombre_aseguradora,
    -- ? Informacion de los requisitos y documentos
    IFNULL(doc_count.cantidad_documentos, 0) AS cantidad_documentos
from
    AplicacionAPoliza polizaAplicacion
    -- ? Joins para obtener datos de usuario y poliza
    join Registro_Global_Usuarios registro_usuarios
        on polizaAplicacion.id_usuario = registro_usuarios.id_usuario
    join Registro_SignUp_Global registro_identidad
        on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
    join PolizasDeSeguro polizas
        on polizaAplicacion.id_poliza = polizas.id_poliza
    join Aseguradoras aseguradoras
        on polizas.id_aseguradora = aseguradoras.id_aseguradora
    -- ? Left Join con documentos y requisitos. En este caso,puede que para la aplcacino
    -- especifica no se haya subid archivos. En este caso usamos left join para que se muestre
    -- la aplicacion sin importar qye haya o no documentos. La subquery interna nos permite
    -- obtener el conteno de documentos de la poliza si fueron registrados, esto elimina
    -- varios registros por tener varios documentos.
    left join (
        select
            id_aplicacion_poliza,
            COUNT(*) as cantidad_documentos
        from
            Documentos_por_AplicacionPoliza
        Group by
            id_aplicacion_poliza
    ) doc_count
        on polizaAplicacion.id_aplicacion_poliza = doc_count.id_aplicacion_poliza
ORDER BY
    polizaAplicacion.fecha_de_aplicacion DESC;