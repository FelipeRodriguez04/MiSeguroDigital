-- ? Elimina poliza por Admin Broker
-- ? Implementa soft delete cambiando estado a despublicada
-- ? Verifica que no tenga registros activos antes de eliminar

create procedure eliminarPolizaPorAdminBroker(
    in polizaId int,
    in brokerId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables de control
    declare polizaExiste int default 0;
    declare registrosActivos int default 0;
    declare aseguradoraId int;
    declare oldEstado varchar(50);
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500; -- Retornamos el vlaor de 5xx para indicar error en el servidor,
        -- en este caso esto representa el retorno incorrecto de la transaccion
        rollback;
    end;
    
    -- ? Inicializar resultado
    set codigoResultado = 200;
    
    start transaction;
    
    -- ? Verificar existencia de poliza y obtener datos
    select
        id_aseguradora,
        estado_de_poliza,
        1
    into
        aseguradoraId,
        oldEstado,
        polizaExiste -- Aqui se usa 1 si la poliza existe y 0 si no, entonces si al final seguimos en cero es que este
    -- select no encontro nada y se mantiene en cero.
    from   PolizasDeSeguro 
    where  id_poliza = polizaId;
    
    -- ? Validar existencia de poliza
    if polizaExiste = 0 then
        set codigoResultado = 404; -- Retornamos 404 porque no se encontro la poliza en la base de datos
        rollback;
    else
        -- ? Verificar si tiene registros activos
        select
            count(*)
        into registrosActivos
        from   RegistroDeUsuarioEnPoliza
        where  id_poliza = polizaId
          and estado_de_registro = 'registro_activo';
        
        -- ? Si tiene registros activos, no permitir eliminacion
        if registrosActivos > 0 then
            set codigoResultado = 409; -- Retornamos 409 para responder al problema de que existen registros
            -- por tanto no se puede eliminar nada
            rollback;
        else
            -- ? Soft delete cambiando estado a despublicada
            update PolizasDeSeguro 
            set    estado_de_poliza = 'despublicada'
            where  id_poliza = polizaId;
            
            -- ? Registrar eliminacion en auditoria
            insert into RegistroAudit_Polizas (
                operacion_realizada,
                id_poliza,
                id_aseguradora,
                antiguo_estatus_poliza,
                cambios_por_broker_id,
                fecha_de_modificacion
            ) values (
                'DELETE',
                polizaId,
                aseguradoraId,
                oldEstado,
                brokerId,
                now()
            );
            
            commit;
        end if;
    end if;
end;