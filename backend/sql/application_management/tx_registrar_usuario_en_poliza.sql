-- ? Registra formalmente a un usuario en una poliza despues de la aprobacion y
-- ? crea el registro en RegistroDeUsuarioEnPoliza que ancla pagos y comentarios en la data

create procedure registrarUsuarioEnPolizaPorAplicacion(
    in aplicacionPolizaId int,
    in adminId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables para datos de la aplicacion
    declare estadoAplicacion enum('pendiente_procesar', 'aprobada', 'rechazada');
    declare usuarioId int;
    declare polizaId int;
    declare duracionContrato int;
    declare registroExistente int default 0;
    declare fechaInicio date;
    declare fechaFin date;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
        begin
            set codigoResultado = 500;
            rollback;
        end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar que la aplicacion existe y esta aprobada
    select estado_actual_aplicacion, id_usuario, id_poliza
    into   estadoAplicacion, usuarioId, polizaId
    from   AplicacionAPoliza
    where  id_aplicacion_poliza = aplicacionPolizaId;

    if estadoAplicacion is null then
        set codigoResultado = 404; -- No exise una aplicacion en base al id de Aplicacion
        rollback;
    elseif estadoAplicacion != 'aprobada' then
        set codigoResultado = 409; -- La solicitud no esta aprobada y no se puede continuar
        rollback;
    else
        -- ? Verificar que no existe registro activo para este usuario y poliza
        select
            1
        into registroExistente
        from   RegistroDeUsuarioEnPoliza
        where  id_usuario = usuarioId
          and estado_de_registro = 'registro_activo'
          and id_poliza = polizaId
          and estado_de_registro = 'registro_activo';

        if registroExistente > 0 then
            set codigoResultado = 409; -- Si tenemos un registro a la salida, el conteno es mayor que el default
            -- Si estamos aqui el problema es que hubo un registro actual already, por lo que
            -- frenamos el proceso de nuevo.
            rollback;
        else
            -- ? Obtener duracion del contrato para calcular fecha de finalizacion
            select duracion_de_contrato into duracionContrato
            from   PolizasDeSeguro
            where  id_poliza = polizaId;

            set fechaInicio = curdate();
            -- ? Este segundo calculo es importante, dado que nos permite calcular el intervalo en
            -- ? meses dado que contabilizamos la fecha de ingreso yfinal de la poliza con DATE
            set fechaFin = date_add(fechaInicio, interval duracionContrato month);

            -- ? Insertar nuevo registro en tabla de polizas de usuario
            insert into RegistroDeUsuarioEnPoliza (
                id_poliza,
                id_usuario,
                id_aplicacion_a_poliza,
                fecha_inicio_registro,
                fecha_finalizacion_registro,
                estado_de_registro
            ) values (
                         polizaId,
                         usuarioId,
                         aplicacionPolizaId,
                         fechaInicio,
                         fechaFin,
                         'registro_activo'
                     );

            -- ? Registrar accion en auditoria
            insert into RegistroAudit_RegistrosPolizas (
                operacion_realizada,
                id_registro_poliza,
                id_usuario,
                id_poliza,
                cambios_por_usuario_id,
                fecha_de_modificacion
            ) values (
                         'INSERT',
                         last_insert_id(),
                         usuarioId,
                         polizaId,
                         adminId,
                         now()
                     );

            commit;
        end if;
    end if;
end ;
