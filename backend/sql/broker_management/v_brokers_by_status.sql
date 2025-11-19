-- ? Vista para mostrar brokers agrupados por estado
-- ? Facilita revision de solicitudes pendientes y gestion
-- ? Incluye informacion de aseguradora para contexto

create or replace view viewBrokersAgrupadosPorEstadoBroker as
select 
    -- ? Estado del broker para agrupacion
    registro_brokers.estado_broker,
    
    -- ? Informacion basica del broker
    registro_brokers.id_broker,
    registro_identidad.correo_registro as email,
    registro_brokers.nombre_prim_broker,
    registro_brokers.apellido_prim_broker,
    registro_brokers.full_nombre_broker,
    registro_brokers.numero_telefono_broker,
    
    -- ? Fechas importantes
    registro_identidad.fecha_registro as application_date,
    
    -- ? Informacion de la aseguradora
    a.nombre_aseguradora,
    a.dominio_correo_aseguradora,
    
    -- ? Rol asignado si ya fue aprobado
    roless_broker.rol_broker as current_role,
    
    -- ? Indicador si tiene rol asignado
    case 
        when roless_broker.id_rol_broker is not null then 'Si'
        else 'No'
    end as has_role_assigned
    
from Registro_SignUp_Global registro_identidad
    -- ? Join con brokers en base al id de identidad para hallar los datos originales de usuario
    join Registro_Global_Brokers registro_brokers
        on registro_identidad.id_identidad = registro_brokers.id_identidad_registro
    -- ? Join con aseguradoras para sacar los detalles delas asegurdaoras
    join Aseguradoras a
        on registro_brokers.id_aseguradora = a.id_aseguradora
    -- ? Left join con roles para ver asignaciones
    left join Roles_Broker roless_broker
        on registro_brokers.id_broker = roless_broker.id_broker
where registro_identidad.estado_actividad_registro = 'activo'

-- ? Ordenar por prioridad de estado y fecha
order by 
    case registro_brokers.estado_broker
        when 'pendiente' then 1
        when 'activo' then 2
        when 'rechazado' then 3
        else 4
    end,
    registro_identidad.fecha_registro asc;