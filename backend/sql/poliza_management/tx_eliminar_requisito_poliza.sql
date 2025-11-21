-- ? Elimina un requisito de una poliza
-- de la tabla de requerimientos

create procedure eliminarRequisitoPolizaPorAdmin(
    in requerimientoId int,
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
        1
    into requerimientoExiste
    from Requerimientos_por_Poliza
    where id_requerimiento = requerimientoId;

    -- ? Validar existencia
    if requerimientoExiste = 0 then
        set codigoResultado = 404; -- Retornamos un 404 dado que no encontramos el
        -- requerimiento enviado a eliminar
        rollback;
    else
        -- ? Eliminar el requerimiento
        delete from Requerimientos_por_Poliza
        where  id_requerimiento = requerimientoId;

        commit;
    end if;
end;
