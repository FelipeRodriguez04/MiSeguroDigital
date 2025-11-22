-- ? Crea una nueva solicitud de poliza para un usuario y
-- ? la registra con estado 'pendiente_procesar'

create procedure crearAplicacionEnPolizaPorUsuario(
    in usuarioId int,
    in polizaId int,
    in bienId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables para validar existencia
    declare usuarioExiste int default 0;
    declare polizaExiste int default 0;
    declare registroExiste int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado como exitoso
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar existencia del usuario
    select
        1
    into usuarioExiste
    from Registro_Global_Usuarios where id_usuario = usuarioId;

    -- ? Verificar que la poliza existe y esta activa
    select
       1
    into polizaExiste
    from PolizasDeSeguro where id_poliza = polizaId
    and estado_de_poliza = 'activa';
    -- ? Verificar que el bien pertenece al usuario
    if bienId is not null then
        select
            1
        into usuarioExiste
        from BienesPorUsuario where id_bien = bienId
        and id_usuario = usuarioId;
        if usuarioExiste = 0 then
            set codigoResultado = 409;
            rollback;
        end if;
    end if;

    -- ? Validar existencia de usuario y poliza
    if usuarioExiste = 0 then
        set codigoResultado = 404;  -- Usuario no encontrado
        rollback;
    elseif polizaExiste = 0 then
        set codigoResultado = 404; -- Poliza no existe
        rollback;
    else
        -- ? Validar que la tuple de valores no exista en la db
            select
                1
            into registroExiste
            from AplicacionAPoliza
            where id_usuario = usuarioId
            and id_poliza = polizaId
            and id_aplicacion_poliza = bienId
            and estado_actual_aplicacion = 'pendiente_procesar';
        -- ? ? Insertar nuevo registro de aplicacion
            if registroExiste = 1 then
                set codigoResultado = 409;
                rollback ;
            end if;
            insert into AplicacionAPoliza (
                id_usuario,
                id_poliza,
                id_bien_asegurado,
                fecha_de_aplicacion,
                estado_actual_aplicacion
            ) values (
                usuarioId,
                polizaId,
                      bienId,
                now(),
                'pendiente_procesar'
            );

        commit;
    end if;
end;