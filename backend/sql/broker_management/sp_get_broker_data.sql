-- ? 1. Procedimiento para obtener datos personales de broker por ID
-- ? 2. Incluye informacion de identidad, perfil, rol y aseguradora
-- ? 3. Usado para que el broker consulte su propia informacion


create procedure getBrokerDataPerBrokerID(
    in BrokerId int,
    out ResultCode int
)
begin
    -- ?  Variables de control
    declare BrokerExists int default 0;
    declare ExitHandlerCalled boolean default false;

    -- ? Handler para capturar errores SQL
    declare exit handler for sqlexception
    begin
        set ExitHandlerCalled = true;
        set ResultCode = 500;
    end;

    -- ?  Inicializar codigo de resultado
    set ResultCode = 200;

    -- ?  Verificar si el broker existe
    select
        1
    into BrokerExists
    from Registro_Global_Brokers registro_brokers
    join Registro_SignUp_Global registro_identidad
        on registro_brokers.id_identidad_registro = registro_identidad.id_identidad
    where registro_brokers.id_broker = BrokerId
        and registro_identidad.estado_actividad_registro = 'activo';

    -- ? 8. Si broker no existe, retornar error
    if BrokerExists = 0 then
        set ResultCode = 404;
        select 'Broker no encontrado' as mensaje;
    else
        -- ? 9. Retornar datos del broker
        select
            registro_broker.id_broker,
            registro_identidad.correo_registro as email,
            registro_broker.nombre_prim_broker,
            registro_broker.apellido_prim_broker,
            registro_broker.full_nombre_broker,
            registro_broker.numero_telefono_broker,
            registro_broker.fecha_nacimiento_broker,
            registro_broker.estado_broker,
            registro_identidad.estado_actividad_registro as is_active,
            registro_identidad.fecha_registro as created_at,
            aseguradora.id_aseguradora,
            aseguradora.nombre_aseguradora,
            aseguradora.dominio_correo_aseguradora,
            roles_brokers.rol_broker as broker_role
        from Registro_Global_Brokers registro_broker
        join Registro_SignUp_Global registro_identidad on registro_broker.id_identidad_registro = registro_identidad.id_identidad
        join Aseguradoras aseguradora on registro_broker.id_aseguradora = aseguradora.id_aseguradora
        left join Roles_Broker roles_brokers on registro_broker.id_broker = roles_brokers.id_broker
        where registro_broker.id_broker = BrokerId;
    end if;
end;