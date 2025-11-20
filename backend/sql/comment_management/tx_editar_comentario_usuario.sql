-- ? Permite que un usuario edite su propio comentario
-- ? Valida que el usuario que edita es el autor original del comentario

create procedure editarComentarioPorUsuario(
    in reviewId int,
    in usuarioId int,
    in rating int,
    in contexto text,
    in tieneHiddenFees tinyint,
    in detalleHiddenFees text,
    out codigoResultado int
)
begin
    -- ? Declarar variables de control
    declare autorOriginalId int;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar que el review existe y obtener autor original
    select
        id_usuario
    into autorOriginalId
    from   ReviewsDeUsuarios
    where  id_review_poliza = reviewId;

    if autorOriginalId is null then
        set codigoResultado = 404; -- En este caso, si no existe un reviewID,entonces
        -- no va a haber un autor original y por tanto no existe la review enviada,
        -- retornamos 404 para indicarnot found el registro.
        rollback;
    elseif autorOriginalId != usuarioId then
        set codigoResultado = 403; -- En este caso,si elusaurio no esl mismo entonces
        -- tenemos un error en la db que determina
        rollback;
    else
        -- ? Actualizar contenido del review
        update ReviewsDePolizas
        set    rating_del_usuario = rating,
               contexto_review = contexto,
               tiene_hidden_fees = tieneHiddenFees,
               detalle_hidden_fees = detalleHiddenFees
        where  id_review = reviewId;

        commit;
    end if;
end;
