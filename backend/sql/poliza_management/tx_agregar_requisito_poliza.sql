-- ? Agrega un requisito a una poliza
-- ? Crea un nuevo registro en la tabla de requerimientos para una poliza especifica

create procedure agregarRequsitisoParaPolizas(
    in polizaId int,
    in tipoRequerimiento enum('registros_medicos', 'estados_de_cuenta', 'historial_crediticio', 'prueba_de_residencia', 'otro'),
    in descripcionRequerimiento text,
    in requerimientoObligatorio tinyint,
    out codigoResultado int
)
begin
    -- ? Declarar variables de control
    declare polizaExiste int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar si la poliza existe
    select
        1
    into polizaExiste
    from PolizasDeSeguro
    where id_poliza = polizaId;

    -- ? Validar existencia de la poliza
    if polizaExiste = 0 then
        set codigoResultado = 404; --  Si el conteo de polizas (que deberia ser uno)
        -- sigue siendo cero, entonces no se encontro la poliza y por tanto 404
        rollback;
    else
        -- ? Insertar el nuevo requerimiento
        insert into Requerimientos_por_Poliza (
            id_poliza,
            tipo_requerimiento,
            descripcion_requerimiento,
            requerimiento_obligatorio
        ) values (
            polizaId,
            tipoRequerimiento,
            descripcionRequerimiento,
            requerimientoObligatorio
        );

        commit;
    end if;
end;
