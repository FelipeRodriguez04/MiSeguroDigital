-- ? Permite que un administrador elimine cualquier comentario
-- ? Realiza borrado fisico del comentario y su vinculo

create procedure eliminarComentarioPorAdmin(
    in reviewId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables de control
    declare reviewExiste int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500; -- Error interno 5xx si hay un rollback
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar que el review existe
    select 1
        into reviewExiste
    from ReviewsDePolizas
    where id_review = reviewId;

    if reviewExiste = 0 then
        set codigoResultado = 404; -- Si no existe la review entonces no eliminamos y
        -- hacemos un return 404.
        rollback;
    else
        -- ? Eliminar vinculo en tabla ReviewsDeUsuarios
        delete
        from ReviewsDeUsuarios
        where id_review_poliza = reviewId;
        -- ? Eliminar comentario de tabla principal
        delete from ReviewsDePolizas where id_review = reviewId;
        commit;
    end if;
end;
