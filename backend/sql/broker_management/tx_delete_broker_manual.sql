-- Elimina broker manualmente por Global Admin
-- Implementa soft delete cambiando estado de registro
-- Limpia roles asociados y registra en auditoria

create procedure eliminarBrokerManual(
    in brokerId int,
    in adminId int,
    out codigoResultado int
)
begin
    -- Declarar variables de control
    declare brokerExiste int default 0;
    declare identityId int default 0;
    
    -- Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;
    
    -- Inicializar resultado
    set codigoResultado = 200;
    
    start transaction;
    
    -- Verificar existencia del broker y obtener identity_id
    select id_identidad_registro, 1
        into   identityId, brokerExiste
    from   Registro_Global_Brokers registro_brokers
    join Registro_SignUp_Global registro_identidad
        on registro_brokers.id_identidad_registro = registro_identidad.id_identidad
    where  registro_brokers.id_broker = brokerId
        and registro_identidad.estado_actividad_registro = 'activo';
    
    -- Si broker no existe o ya esta inactivo
    if brokerExiste = 0 then
        set codigoResultado = 404;
        rollback;
    else
        -- Eliminar roles del broker si existen
        delete from Roles_Broker 
        where  id_broker = brokerId;
        
        -- Soft delete del registro principal
        update Registro_SignUp_Global 
        set    estado_actividad_registro = 'inactivo'
        where  id_identidad = identityId;
        
        -- Registrar eliminacion en auditoria
        insert into RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            fecha_modificacion_usuario
        ) values (
            brokerId,
            adminId,
            'DELETE',
            now()
        );
        
        commit;
    end if;
end;