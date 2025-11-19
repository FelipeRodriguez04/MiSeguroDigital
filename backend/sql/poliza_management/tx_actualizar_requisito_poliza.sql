-- ? Actualiza un requisito existente de una poliza
-- ? Permite cambiar los detalles de un requerimiento especifico

create procedure actualizarRequisitosDeUnaPoliza(
    in requerimientoId int,
    in tipoRequerimiento enum('registros_medicos', 'estados_de_cuenta', 'historial_crediticio', 'prueba_de_residencia', 'otro'),
    in descripcionRequerimiento text,
    in requerimientoObligatorio tinyint,
    out codigoResultado int
)
begin
    -- ? Declarar variables de control
    declare requerimientoExiste int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar si el requerimiento existe
    select
        count(*)  --  Registramos el conteo del requerimiento por poliza si existe el ID
    -- esperariamos que sea 1, si sgue como cero entonces el requerimiento no existe.
    into requerimientoExiste
    from Requerimientos_por_Poliza
    where id_requerimiento = requerimientoId;

    -- ? Validar existencia
    if requerimientoExiste = 0 then
        set codigoResultado = 404; -- Retornamos 404, dado que no encontramos
        -- un registro especifico en requerimientoId
        rollback;
    else
        -- ? Actualizar el requerimiento
        update Requerimientos_por_Poliza
        set
            tipo_requerimiento = tipoRequerimiento,
            descripcion_requerimiento = descripcionRequerimiento,
            requerimiento_obligatorio = requerimientoObligatorio
        where  id_requerimiento = requerimientoId;

        commit;
    end if;
end;
