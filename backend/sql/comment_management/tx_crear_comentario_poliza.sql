-- ? Permite que un usuario cree un nuevo comentario para una poliza
-- ? Valida que el usuario este registrado activamente en la poliza

create procedure crearComentarioPolizaPorUsuario(
    in usuarioId int,
    in polizaId int,
    in rating int,
    in contexto text,
    in tieneHiddenFees tinyint,
    in detalleHiddenFees text,
    out codigoResultado int,
    out nuevoReviewId int
)
begin
    -- ? Declarar variables de control
    declare registroActivoExiste int default 0;
    declare reviewId int;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;  -- 5xx server error code!
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;
    set nuevoReviewId = 0;

    start transaction;

    -- ? Validar que el usuario tiene registro activo para esta poliza
    select 1
        into registroActivoExiste
    from   RegistroDeUsuarioEnPoliza
    where  id_usuario = usuarioId
      and id_poliza = polizaId
      and estado_de_registro = 'registro_activo';

    if registroActivoExiste = 0 then
        set codigoResultado = 403; -- 403 Si no existe un registro (403 seria un rediret)
        -- pero en este caso lo usamos para determinar que el problema
        rollback;
    else
        -- ? Insertar contenido del review en tabla principal
        insert into ReviewsDePolizas (
            rating_del_usuario,
            contexto_review,
            tiene_hidden_fees,
            detalle_hidden_fees
        ) values (
            rating,
            contexto,
            tieneHiddenFees,
            detalleHiddenFees
        );

        set reviewId = last_insert_id();
        set nuevoReviewId = reviewId;

        -- ? Vincular review con usuario y poliza
        insert into ReviewsDeUsuarios (
            id_review_poliza,
            id_usuario,
            id_poliza,
            fecha_creacion_review
        ) values (
            reviewId,
            usuarioId,
            polizaId,
            curdate()
        );

        commit;
    end if;
end;
