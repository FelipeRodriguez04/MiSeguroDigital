-- ? Procedure para obtener el salt de un usuario por email
create procedure obtenerSaltUsuario(
    in email varchar(255),
    out codigoResultado int,
    out passwordSalt varchar(512)
)
begin
    -- ? Declarar variables
    declare usuarioCount int default 0;
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        set passwordSalt = null;
    end;
    
    -- ? Inicializar codigo de resultado
    set codigoResultado = 404;
    set passwordSalt = null;
    
    -- ? Buscar salt del usuario
    select 
        count(*),
        registro_identidad.hashed_pwd_salt_registro
    into 
        usuarioCount,
        passwordSalt
    from Registro_SignUp_Global registro_identidad
    where registro_identidad.correo_registro = email
    and registro_identidad.estado_actividad_registro = 'activo';
    
    -- ? Si usuario existe, retornar salt
    if usuarioCount > 0 then
        set codigoResultado = 200;
    end if;
end;