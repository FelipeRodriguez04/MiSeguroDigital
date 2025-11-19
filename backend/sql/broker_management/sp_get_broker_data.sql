-- ? 1. Procedimiento para obtener datos personales de broker por ID
-- ? 2. Incluye informacion de identidad, perfil, rol y aseguradora
-- ? 3. Usado para que el broker consulte su propia informacion

delimiter $$

create procedure sp_get_broker_data(
    in BrokerId int,
    out ResultCode int
)
begin
    -- ? 4. Variables de control
    declare BrokerExists int default 0;
    declare ExitHandlerCalled boolean default false;
    
    -- ? 5. Handler para capturar errores SQL
    declare exit handler for sqlexception
    begin
        set ExitHandlerCalled = true;
        set ResultCode = 500;
    end;
    
    -- ? 6. Inicializar codigo de resultado
    set ResultCode = 200;
    
    -- ? 7. Verificar si el broker existe
    select count(*) into BrokerExists
    from Registro_Global_Brokers b
    inner join Registro_SignUp_Global r on b.id_identidad_registro = r.id_identidad
    where b.id_broker = BrokerId 
    and r.estado_actividad_registro = 'activo';
    
    -- ? 8. Si broker no existe, retornar error
    if BrokerExists = 0 then
        set ResultCode = 404;
        select 'Broker no encontrado' as mensaje;
    else
        -- ? 9. Retornar datos del broker
        select 
            b.id_broker,
            r.correo_registro as email,
            b.nombre_prim_broker,
            b.apellido_prim_broker,
            b.full_nombre_broker,
            b.numero_telefono_broker,
            b.fecha_nacimiento_broker,
            b.estado_broker,
            r.estado_actividad_registro as is_active,
            r.fecha_registro as created_at,
            a.id_aseguradora,
            a.nombre_aseguradora,
            a.dominio_correo_aseguradora,
            rb.rol_broker as broker_role
        from Registro_Global_Brokers b
        inner join Registro_SignUp_Global r on b.id_identidad_registro = r.id_identidad
        inner join Aseguradoras a on b.id_aseguradora = a.id_aseguradora
        left join Roles_Broker rb on b.id_broker = rb.id_broker
        where b.id_broker = BrokerId;
    end if;
    
end$$

delimiter ;