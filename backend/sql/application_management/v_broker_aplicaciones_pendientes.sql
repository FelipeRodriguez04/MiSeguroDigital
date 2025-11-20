-- ? Vista para que los analistas de broker vean las solicitudes pendientes
-- ? Muestra las solicitudes asociadas a las polizas de su aseguradora

create or replace view viewAplicacionesPendientesPorBroker as
select
    -- ? Informacion de la aplicacion
    aplicacionPoliza.id_aplicacion_poliza,
    aplicacionPoliza.fecha_de_aplicacion,
    aplicacionPoliza.estado_actual_aplicacion,
    -- ? Informacion del usuario que aplica
    registro_usuarios.id_usuario,
    registro_usuarios.full_nombre_usuario,
    registro_identidad.correo_registro as email_usuario,
    -- ? Informacion de la poliza
    polizas.id_poliza,
    polizas.nombre_de_la_poliza,
    -- ? Informacion de la aseguradora para filtrado
    aseguradoras.id_aseguradora,
    aseguradoras.nombre_aseguradora
from
    AplicacionAPoliza aplicacionPoliza
    -- ? Unir con usuarios para obtener su informacion
    join Registro_Global_Usuarios registro_usuarios
        on aplicacionPoliza.id_usuario = registro_usuarios.id_usuario
    join Registro_SignUp_Global registro_identidad
        on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
    -- ? Unir con polizas para obtener su informacion
    join PolizasDeSeguro polizas
        on aplicacionPoliza.id_poliza = polizas.id_poliza
    -- ? Unir con aseguradoras para filtrar por broker
    join Aseguradoras aseguradoras
        on polizas.id_aseguradora = aseguradoras.id_aseguradora
where
    -- ? Mostrar solo las que estan pendientes de procesar
    aplicacionPoliza.estado_actual_aplicacion = 'pendiente_procesar'
order by
    -- ? Ordenar por fecha de aplicacion ascendente para procesar las mas antiguas primero
    aplicacionPoliza.fecha_de_aplicacion asc;
