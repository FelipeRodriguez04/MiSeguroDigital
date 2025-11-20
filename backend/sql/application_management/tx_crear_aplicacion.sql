-- ? Crea una nueva solicitud de poliza para un usuario y
-- ? la registra con estado 'pendiente_procesar'

create procedure crearAplicacionEnPolizaPorUsuario(
    in usuarioId int,
    in polizaId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables para validar existencia
    declare usuarioExiste int default 0;
    declare polizaExiste int default 0;

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
    select count(*) into usuarioExiste 
    from Registro_Global_Usuarios where id_usuario = usuarioId;

    -- ? Verificar que la poliza existe y esta activa
    select count(*) into polizaExiste 
    from PolizasDeSeguro where id_poliza = polizaId 
    and estado_de_poliza = 'activa';

    -- ? Validar existencia de usuario y poliza
    if usuarioExiste = 0 then
        set codigoResultado = 404;  -- Usuario no encontrado
        rollback;
    elseif polizaExiste = 0 then
        set codigoResultado = 404; -- Poliza no existe
        rollback;
    else
        -- ? ? Insertar nuevo registro de aplicacion
        insert into aplicacionapoliza (
            id_usuario,
            id_poliza,
            fecha_de_aplicacion,
            estado_actual_aplicacion
        ) values (
            usuarioId,
            polizaId,
            now(),
            'pendiente_procesar'
        );

        commit;
    end if;
end;
