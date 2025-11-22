create procedure obtenerBienesRegistradosPorUsuario(
    in idUsuario int
)

begin
    select
        bienes_por_usuario.id_bien,
        bienes_por_usuario.tipo_de_bien,
        bienes_por_usuario.valoracion_bien
    from BienesPorUsuario bienes_por_usuario
    where bienes_por_usuario.id_usuario = idUsuario;
end;

create procedure obtenerBienesRegistradosPorUsuarioYTipo(
    in idUsuario int,
    in tipoBien enum ('bien_inmueble', 'bien_automotriz', 'otro')
)
begin
    select
        bienes_por_usuario.id_bien,
        bienes_por_usuario.tipo_de_bien,
        bienes_por_usuario.valoracion_bien
    from BienesPorUsuario bienes_por_usuario
    where bienes_por_usuario.id_usuario = idUsuario and bienes_por_usuario.tipo_de_bien = tipoBien;
end;

create procedure obtenerBienesAseguradosPorUsuario(
    in idUsuario int
)
begin
    select
        bienes_asegurados.id_bien_del_usuario,
        bienes_asegurados.id_registro_en_poliza,
        bienes_por_usuario.tipo_de_bien,
        bienes_por_usuario.valoracion_bien,
        polizas.tipo_de_poliza,
        polizas.monto_cobertura_total
    from BienesAseguradosPorUsuario bienes_asegurados
    join BienesPorUsuario bienes_por_usuario
        on bienes_asegurados.id_bien_del_usuario = bienes_por_usuario.id_bien
    join RegistroDeUsuarioEnPoliza registro
        on bienes_asegurados.id_registro_en_poliza = registro.id_registro_en_poliza
    join PolizasDeSeguro polizas
        on registro.id_poliza = polizas.id_poliza
    where bienes_por_usuario.id_usuario = idUsuario;
end;


create procedure obtenerBienesAseguradosPorUsuarioYPoliza(
    in idUsuario int,
    in idPoliza int
)
begin
    select
        bienes_asegurados.id_bien_del_usuario,
        bienes_asegurados.id_registro_en_poliza,
        bienes_por_usuario.tipo_de_bien,
        bienes_por_usuario.valoracion_bien,
        polizas.tipo_de_poliza,
        polizas.monto_cobertura_total
    from BienesAseguradosPorUsuario bienes_asegurados
    join BienesPorUsuario bienes_por_usuario
        on bienes_asegurados.id_bien_del_usuario = bienes_por_usuario.id_bien
    join RegistroDeUsuarioEnPoliza registro
        on bienes_asegurados.id_registro_en_poliza = registro.id_registro_en_poliza
    join PolizasDeSeguro polizas
        on registro.id_poliza = polizas.id_poliza
    where bienes_por_usuario.id_usuario = idUsuario and polizas.id_poliza = idPoliza;
end;
