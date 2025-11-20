-- ? Vista para que un usuario vea sus solicitudes de poliza
-- ? Muestra el historial de solicitudes de un usuario especifico

create or replace view viewAplicacionesPolizaPorUsuario as
select
    -- ? Informacion del usuario
    registro_usuarios.id_usuario,
    -- ? Informacion de la aplicacion
    aplicacionPoliza.id_aplicacion_poliza,
    aplicacionPoliza.fecha_de_aplicacion,
    aplicacionPoliza.estado_actual_aplicacion,
    -- ? Informacion de la poliza
    polizas.nombre_de_la_poliza,
    polizas.tipo_de_poliza,
    -- ? Informacion de la aseguradora
    aseguradora.nombre_aseguradora
from
    AplicacionAPoliza aplicacionPoliza
    -- ? Unir con la tabla de usuarios para obtener el ID del usuario
    join Registro_Global_Usuarios registro_usuarios
        on aplicacionPoliza.id_usuario = registro_usuarios.id_usuario
    -- ? Unir con la tabla de polizas para obtener el nombre de la poliza
    join PolizasDeSeguro polizas
        on aplicacionPoliza.id_poliza = polizas.id_poliza
    -- ? Unir con la tabla de aseguradoras para obtener el nombre de la aseguradora
    join Aseguradoras aseguradora
        on polizas.id_aseguradora = aseguradora.id_aseguradora
order by
    -- ? Ordenar por fecha de aplicacion descendente
    aplicacionPoliza.fecha_de_aplicacion desc;
