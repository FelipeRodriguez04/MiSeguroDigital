-- ? Registra un nuevo bien para un usuario
-- ? Valida que el usuario exista y que no haya duplicados de nombre_bien, valoracion_bien y tipo_de_bien
delimiter $$
create procedure registrarBienPorUsuario(
    in iDUsuario INT,
    in nombreBien VARCHAR(255),
    in valoracionBien DECIMAL(10,2),
    in tipoDeBien enum ('bien_inmueble', 'bien_automotriz', 'otro'),
    out codigoOperacion INT,
    out idBienRegistrado INT
)
begin
    -- ? Declarar variables de control
    declare usuarioExiste int default 0;
    declare bienDuplicado int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoOperacion = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoOperacion = 200;
    set idBienRegistrado = 0;

    start transaction;

    -- ? Validar que el usuario existe
    select
        1
    into usuarioExiste
    from   Registro_Global_Usuarios
    where  id_usuario = iDUsuario;

    if usuarioExiste = 0 then
        set codigoOperacion = 404; -- Usuario no existe
        rollback;
    else
        -- ? Verificar si ya existe un bien con la misma combinacion
        select
            1
        into bienDuplicado
        from   BienesPorUsuario
        where  id_usuario = iDUsuario
          and nombre_bien = nombreBien
          and valoracion_bien = valoracionBien
          and tipo_de_bien = tipoDeBien;

        if bienDuplicado > 0 then
            set codigoOperacion = 409; -- Bien duplicado
            rollback;
        else
            -- ? Insertar nuevo bien
            insert into BienesPorUsuario (
                id_usuario,
                nombre_bien,
                valoracion_bien,
                tipo_de_bien
            ) values (
                iDUsuario,
                nombreBien,
                valoracionBien,
                tipoDeBien
            );

            set idBienRegistrado = last_insert_id();

            commit;
        end if;
    end if;
end $$
delimiter ;


-- ? Modifica un bien existente de un usuario
-- ? Valida que el bien exista y pertenezca al usuario, y que no genere duplicados
delimiter $$
create procedure modificarBienRegistradoPorUsuario(
    in idBien INT,
    in iDUsuario INT,
    in nombreBien VARCHAR(255),
    in valoracionBien DECIMAL(10,2),
    in tipoDeBien enum ('bien_inmueble', 'bien_automotriz', 'otro'),
    out codigoOperacion INT
)
begin
    -- ? Declarar variables de control
    declare bienExiste int default 0;
    declare bienDuplicado int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoOperacion = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoOperacion = 200;

    start transaction;

    -- ? Validar que el bien existe y pertenece al usuario
    select
        1
    into bienExiste
    from   BienesPorUsuario
    where  id_bien = idBien
      and id_usuario = iDUsuario;

    if bienExiste = 0 then
        set codigoOperacion = 404; -- Bien no existe o no pertenece al usuario
        rollback;
    else
        -- ? Verificar duplicados excluyendo el bien actual
        select
           1
        into bienDuplicado
        from   BienesPorUsuario
        where  id_usuario = iDUsuario
          and nombre_bien = nombreBien
          and valoracion_bien = valoracionBien
          and tipo_de_bien = tipoDeBien
          and id_bien != idBien;

        if bienDuplicado > 0 then
            set codigoOperacion = 409; -- Modificacion generaria duplicado
            rollback;
        else
            -- ? Actualizar bien
            update BienesPorUsuario
            set nombre_bien = nombreBien,
                valoracion_bien = valoracionBien,
                tipo_de_bien = tipoDeBien
            where id_bien = idBien
              and id_usuario = iDUsuario;

            commit;
        end if;
    end if;
end $$
delimiter ;

-- ? Elimina un bien registrado de un usuario
-- ? Valida que el bien exista y pertenezca al usuario
delimiter $$

create procedure eliminarBienRegistradoPorUsuario(
    in idBien INT,
    in iDUsuario INT,
    out codigoOperacion INT
)
begin
    -- ? Declarar variables de control
    declare bienExiste int default 0;
    declare bienAsegurado int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoOperacion = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoOperacion = 200;

    start transaction;

    -- ? Validar que el bien existe y pertenece al usuario
    select
        1
    into bienExiste
    from   BienesPorUsuario
    where  id_bien = idBien
      and id_usuario = iDUsuario;

    select
        1
    into bienAsegurado
    from   BienesAseguradosPorUsuario
    where  id_bien_del_usuario = idBien;

    if bienExiste = 0 then
        set codigoOperacion = 404; -- Bien no existe o no pertenece al usuario
        rollback;
    else
        if bienAsegurado = 1 then
            set codigoOperacion = 403;
            rollback;
        end if;

        -- ? Eliminar bien
        delete from BienesPorUsuario
        where id_bien = idBien
          and id_usuario = iDUsuario;

        commit;
    end if;
end $$
delimiter ;

-- ? Procedure para poder asegurar un biene existente por el usuario,
-- ? para esto usamos el id del bien y el id de la poliza

-- ? Asegura un bien registrado vinculandolo a un registro de poliza
-- ? Valida que el bien y el registro existan y pertenezcan al mismo usuario

delimiter $$
create procedure asegurarBienRegistradoPorUsuario(
    in idBienRegistradoPorUsuario INT,
    in idRegistroEnPoliza INT,
    out codigoOperacion INT
)
begin
    -- ? Declarar variables de control
    declare bienExiste int default 0;
    declare registroExiste int default 0;
    declare usuarioBien int;
    declare usuarioRegistro int;
    declare yaAsegurado int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoOperacion = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoOperacion = 200;

    start transaction;

    -- ? Validar que el bien existe y obtener su usuario
    select
        1, id_usuario
    into bienExiste, usuarioBien
    from   BienesPorUsuario
    where  id_bien = idBienRegistradoPorUsuario;

    -- ? Validar que el registro existe y obtener su usuario
    select
        1, id_usuario
    into registroExiste, usuarioRegistro
    from   RegistroDeUsuarioEnPoliza
    where  id_registro_en_poliza = idRegistroEnPoliza
      and estado_de_registro = 'registro_activo';

    if bienExiste = 0 then
        set codigoOperacion = 404; -- Bien no existe
        rollback;
    elseif registroExiste = 0 then
        set codigoOperacion = 404; -- Registro no existe o no esta activo
        rollback;
    elseif usuarioBien != usuarioRegistro then
        set codigoOperacion = 403; -- Bien y registro no pertenecen al mismo usuario
        rollback;
    else
        -- ? Verificar si ya esta asegurado
        select
            1
        into yaAsegurado
        from   BienesAseguradosPorUsuario
        where  id_bien_del_usuario = idBienRegistradoPorUsuario
          and id_registro_en_poliza = idRegistroEnPoliza;

        if yaAsegurado > 0 then
            set codigoOperacion = 409; -- Ya esta asegurado
            rollback;
        else
            -- ? Crear asociacion
            insert into BienesAseguradosPorUsuario (
                id_registro_en_poliza,
                id_bien_del_usuario,
                fecha_asociacion_cobertura_a_bien
            ) values (
                idRegistroEnPoliza,
                idBienRegistradoPorUsuario,
                curdate()
            );

            commit;
        end if;
    end if;
end $$
delimiter ;

-- ? Elimina el seguro de un bien registrado
-- ? Valida que la asociacion exista

delimiter $$
create procedure eliminarSeguroBienRegistradoPorUsuario(
    in idBienRegistradoPorUsuario INT,
    in idRegistroEnPoliza INT,
    out codigoOperacion INT
)
begin
    -- ? Declarar variables de control
    declare asociacionExiste int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoOperacion = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoOperacion = 200;

    start transaction;

    -- ? Validar que la asociacion existe
    select
        1
    into asociacionExiste
    from   BienesAseguradosPorUsuario
    where  id_bien_del_usuario = idBienRegistradoPorUsuario
      and id_registro_en_poliza = idRegistroEnPoliza;

    if asociacionExiste = 0 then
        set codigoOperacion = 404; -- Asociacion no existe
        rollback;
    else
        -- ? Eliminar asociacion
        delete from BienesAseguradosPorUsuario
        where id_bien_del_usuario = idBienRegistradoPorUsuario
          and id_registro_en_poliza = idRegistroEnPoliza;

        commit;
    end if;
end $$
delimiter ;

