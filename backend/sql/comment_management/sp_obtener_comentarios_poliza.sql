-- ? Obtiene todos los comentarios de una poliza especifica
-- ? Devuelve informacion del comentario y del usuario que lo creo

create procedure obtenerComentariosPorIDPoliza(
    in polizaId int
)
begin
    -- ? Seleccionar datos del comentario y del usuario
    select
        reviews_de_poliza.id_review,
        reviews_de_poliza.rating_del_usuario,
        reviews_de_poliza.contexto_review,
        reviews_de_poliza.tiene_hidden_fees,
        reviews_de_poliza.detalle_hidden_fees,
        reviews_usuarios.fecha_creacion_review,
        registro_usuarios.full_nombre_usuario
    from
        ReviewsDePolizas reviews_de_poliza
    -- ? Unir con tabla de vinculo para filtrar por poliza
    join ReviewsDeUsuarios reviews_usuarios
        on reviews_de_poliza.id_review = reviews_usuarios.id_review_poliza
    -- ? Unir con tabla de usuarios para obtener nombre del autor
    join Registro_Global_Usuarios registro_usuarios
        on reviews_usuarios.id_usuario = registro_usuarios.id_usuario
    where
        reviews_usuarios.id_poliza = polizaId
    order by
        reviews_usuarios.fecha_creacion_review desc;
end;
