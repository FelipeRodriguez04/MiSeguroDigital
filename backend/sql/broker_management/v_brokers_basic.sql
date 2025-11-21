-- ? Vista para mostrar brokers con informacion consolidada
-- ? Une tablas de registro, brokers, aseguradoras y roles
-- ? Muestra solo brokers activos para administracion

create or replace view viewBrokerInfoBasica as
select 
    -- ? Campos principales del broker
    registro_brokers.id_broker,
    registro_identidad.correo_registro as email,
    registro_brokers.nombre_prim_broker,
    registro_brokers.apellido_prim_broker,
    registro_brokers.full_nombre_broker,
    registro_brokers.numero_telefono_broker,
    registro_brokers.fecha_nacimiento_broker,
    
    -- ? Estado del broker y fechas
    registro_brokers.estado_broker,
    registro_identidad.estado_actividad_registro as is_active,
    registro_identidad.fecha_registro as created_at,
    
    -- ? Informacion de la aseguradora
    aseguradoras.id_aseguradora,
    aseguradoras.nombre_aseguradora,
    aseguradoras.dominio_correo_aseguradora,
    
    -- ? Rol del broker si tiene asignado
    rb.rol_broker as broker_role
    
from Registro_SignUp_Global registro_identidad
    -- ? Join con brokers para informacion personal
    join Registro_Global_Brokers registro_brokers
        on registro_identidad.id_identidad
               = registro_brokers.id_identidad_registro
    -- ? Join con aseguradoras para informacion de la empresa
    join Aseguradoras aseguradoras
        on registro_brokers.id_aseguradora = aseguradoras.id_aseguradora
    -- ? Left join con roles de broker para obtener nivel.  Aqui hacemos
    -- un left  join dado que puede haber brokers que no tienen un rol asignado,dado
    -- que estos se crean a la hora de actualizar el estado a aprobado.
    left join Roles_Broker rb
        on registro_brokers.id_broker = rb.id_broker
where registro_identidad.estado_actividad_registro in ('activo', 'inactivo')
-- ? Ordenar por estado del broker y fecha de registro
order by 
    case registro_brokers.estado_broker
        when 'pendiente' then 1
        when 'activo' then 2
        when 'rechazado' then 3
        else 4
    end,
    registro_identidad.fecha_registro desc;