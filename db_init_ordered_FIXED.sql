/*
* ? Archivo de configuracion de SQL para toda la base de datos de la aplicacion.
* ? Mi seguro Digital 
* ? 18-Nov-2025
* ? La idea de este script es definir especificamente todos los componentes requeridos paara
* ? el manejo de la carga inicial de la estructura de la base de datos. En este contexto 
* ? el document contiene primero el esquema base. Luego tiene las vistas y transacciones, 
* ? y a final tiene toda la carga de datos iniciales de prueba
*/

-- DB INIT SCRIPT: sacado desdel el workbench 

set @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
set @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
set @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema MiSeguroDigital
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema MiSeguroDigital
-- -----------------------------------------------------
CREATE SCHEMA if not EXISTS `MiSeguroDigital` default CHARACTER set utf8 ;
USE `MiSeguroDigital` ;

-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Registro_SignUp_Global`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`Registro_SignUp_Global` (
  `id_identidad` int not NULL AUTO_INCREMENT,
  `correo_registro` VARCHAR(255) not NULL,
  `hashed_pwd_registro` VARCHAR(512) not NULL,
  `hashed_pwd_salt_registro` VARCHAR(512) not NULL,
  `estado_actividad_registro` ENUM('activo', 'inactivo') not NULL default 'activo',
  `fecha_registro` TIMESTAMP not NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_identidad`),
  UNIQUE INDEX `correo_registro_UNIQUE` (`correo_registro` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Registro_Global_Usuarios`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`Registro_Global_Usuarios` (
  `id_usuario` int not NULL AUTO_INCREMENT,
  `id_identidad_registro` int not NULL,
  `nombre_prim_usuario` VARCHAR(255) not NULL,
  `apellido_prim_usuario` VARCHAR(255) not NULL,
  `full_nombre_usuario` VARCHAR(512) not NULL,
  `numero_telefono_usuario` VARCHAR(50) not NULL,
  `fecha_nacimiento_usuario` DATE not NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `id_usuario_UNIQUE` (`id_usuario` ASC) VISIBLE,
  INDEX `fk_Registro_Global_Usuarios_Registro_SignUp_Global_idx` (`id_identidad_registro` ASC) VISIBLE,
  CONSTRAINT `fk_Registro_Global_Usuarios_Registro_SignUp_Global`
    FOREIGN KEY (`id_identidad_registro`)
    REFERENCES `MiSeguroDigital`.`Registro_SignUp_Global` (`id_identidad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 0;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Aseguradoras`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`Aseguradoras` (
  `id_aseguradora` int not NULL AUTO_INCREMENT,
  `nombre_aseguradora` VARCHAR(255) not NULL,
  `dominio_correo_aseguradora` VARCHAR(255) not NULL,
  `calle_principal_aseguradora` VARCHAR(255) not NULL,
  `calle_secundaria_aseguradora` VARCHAR(255) not NULL,
  `edifico_aseguradora` VARCHAR(255) NULL,
  `numero_oficina_aseguradora` VARCHAR(255) not NULL,
  `telefono_aseguradora` VARCHAR(50) not NULL,
  `sitio_web_aseguradora` VARCHAR(255) not NULL,
  PRIMARY KEY (`id_aseguradora`),
  UNIQUE INDEX `dominio_correo_aseguradora_UNIQUE` (`dominio_correo_aseguradora` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Registro_Global_Brokers`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`Registro_Global_Brokers` (
  `id_broker` int not NULL AUTO_INCREMENT,
  `id_identidad_registro` int not NULL,
  `id_aseguradora` int not NULL,
  `nombre_prim_broker` VARCHAR(255) not NULL,
  `apellido_prim_broker` VARCHAR(255) not NULL,
  `full_nombre_broker` VARCHAR(512) not NULL,
  `numero_telefono_broker` VARCHAR(50) not NULL,
  `fecha_nacimiento_broker` DATE not NULL,
  `estado_broker` ENUM('pendiente', 'rechazado', 'activo') not NULL default 'pendiente',
  PRIMARY KEY (`id_broker`),
  UNIQUE INDEX `id_usuario_UNIQUE` (`id_broker` ASC) VISIBLE,
  INDEX `fk_Registro_Global_Usuarios_Registro_SignUp_Global_idx` (`id_identidad_registro` ASC) VISIBLE,
  INDEX `FK_aseguradora_broker_idx` (`id_aseguradora` ASC) VISIBLE,
  CONSTRAINT `fk_Registro_Global_Usuarios_Registro_SignUp_Global0`
    FOREIGN KEY (`id_identidad_registro`)
    REFERENCES `MiSeguroDigital`.`Registro_SignUp_Global` (`id_identidad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_aseguradora_broker`
    FOREIGN KEY (`id_aseguradora`)
    REFERENCES `MiSeguroDigital`.`Aseguradoras` (`id_aseguradora`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 0;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Roles_Broker`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`Roles_Broker` (
  `id_rol_broker` int not NULL AUTO_INCREMENT,
  `id_broker` int not NULL,
  `rol_broker` ENUM('broker_superadmin', 'broker_admin', 'broker_analyst') not NULL default 'broker_analyst',
  PRIMARY KEY (`id_rol_broker`),
  INDEX `FK_broker_a_rol_idx` (`id_broker` ASC) VISIBLE,
  CONSTRAINT `FK_broker_a_rol`
    FOREIGN KEY (`id_broker`)
    REFERENCES `MiSeguroDigital`.`Registro_Global_Brokers` (`id_broker`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`PolizasDeSeguro`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`PolizasDeSeguro` (
  `id_poliza` int not NULL AUTO_INCREMENT,
  `id_aseguradora` int not NULL,
  `nombre_de_la_poliza` VARCHAR(255) not NULL,
  `descripcion_de_la_poliza` TEXT not NULL,
  `tipo_de_poliza` ENUM('seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud') not NULL,
  `pago_mensual` DECIMAL(10,2) not NULL,
  `monto_cobertura_total` DECIMAL(15,2) NULL,
  `duracion_de_contrato` int not NULL,
  `porcentaje_de_aprobacion` DECIMAL(5,2) not NULL,
  `importe_por_cancelacion` DECIMAL(10,2) not NULL,
  `estado_de_poliza` ENUM('activa', 'pausada', 'despublicada') not NULL default 'activa',
  PRIMARY KEY (`id_poliza`),
  INDEX `FK_AseguradoraToPoliza_idx` (`id_aseguradora` ASC) VISIBLE,
  CONSTRAINT `FK_AseguradoraToPoliza`
    FOREIGN KEY (`id_aseguradora`)
    REFERENCES `MiSeguroDigital`.`Aseguradoras` (`id_aseguradora`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`AplicacionAPoliza`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`AplicacionAPoliza` (
  `id_aplicacion_poliza` int not NULL AUTO_INCREMENT,
  `id_usuario` int not NULL,
  `id_poliza` int not NULL,
  `id_broker_que_reviso` int NULL,
  `fecha_de_aplicacion` TIMESTAMP not NULL default CURRENT_TIMESTAMP,
  `estado_actual_aplicacion` ENUM('pendiente_procesar', 'aprobada', 'rechazada') not NULL default 'pendiente_procesar',
  `razon_de_rechazo` TEXT NULL,
  PRIMARY KEY (`id_aplicacion_poliza`),
  INDEX `FK_UserToApplication_idx` (`id_usuario` ASC) VISIBLE,
  INDEX `FK_PolizaToApplication_idx` (`id_poliza` ASC) VISIBLE,
  INDEX `FK_BrokerToApplication_idx` (`id_broker_que_reviso` ASC) VISIBLE,
  CONSTRAINT `FK_UserToApplication`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `MiSeguroDigital`.`Registro_Global_Usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_PolizaToApplication`
    FOREIGN KEY (`id_poliza`)
    REFERENCES `MiSeguroDigital`.`PolizasDeSeguro` (`id_poliza`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_BrokerToApplication`
    FOREIGN KEY (`id_broker_que_reviso`)
    REFERENCES `MiSeguroDigital`.`Registro_Global_Brokers` (`id_broker`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`RegistroDeUsuarioEnPoliza`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`RegistroDeUsuarioEnPoliza` (
  `id_registro_en_poliza` int not NULL AUTO_INCREMENT,
  `id_poliza` int not NULL,
  `id_usuario` int not NULL,
  `id_aplicacion_a_poliza` int not NULL,
  `fecha_inicio_registro` DATE not NULL,
  `fecha_finalizacion_registro` DATE not NULL,
  `poliza_con_autorenew` TINYINT not NULL default 0,
  `estado_de_registro` ENUM('registro_activo', 'registro_cancelado', 'registro_expirado') not NULL default 'registro_activo',
  `fecha_de_cancelacion` DATE NULL,
  PRIMARY KEY (`id_registro_en_poliza`),
  INDEX `fk_PolizasDeSeguro_has_Registro_Global_Usuarios_Registro_Gl_idx` (`id_usuario` ASC) VISIBLE,
  INDEX `fk_PolizasDeSeguro_has_Registro_Global_Usuarios_PolizasDeSe_idx` (`id_poliza` ASC) VISIBLE,
  INDEX `FK_ApplicationToRegistry_idx` (`id_aplicacion_a_poliza` ASC) VISIBLE,
  CONSTRAINT `fk_PolizasDeSeguro_has_Registro_Global_Usuarios_PolizasDeSegu1`
    FOREIGN KEY (`id_poliza`)
    REFERENCES `MiSeguroDigital`.`PolizasDeSeguro` (`id_poliza`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PolizasDeSeguro_has_Registro_Global_Usuarios_Registro_Glob1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `MiSeguroDigital`.`Registro_Global_Usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ApplicationToRegistry`
    FOREIGN KEY (`id_aplicacion_a_poliza`)
    REFERENCES `MiSeguroDigital`.`AplicacionAPoliza` (`id_aplicacion_poliza`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`PagosPorPoliza`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`PagosPorPoliza` (
  `id_pago` int not NULL AUTO_INCREMENT,
  `id_registro_poliza` int not NULL,
  `cantidad_pago` DECIMAL(10,2) not NULL,
  `metodo_de_pago` ENUM('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'cheque', 'otro') not NULL,
  `estado_del_pago` ENUM('pendiente', 'completado', 'fallido', 'reembolsado') not NULL default 'pendiente',
  `motivo_del_pago` ENUM('pago_mensualidad', 'pago_importe_cancelacion') not NULL,
  `fecha_de_pago` TIMESTAMP not NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pago`),
  INDEX `FK_UsuarioAPago_idx` (`id_registro_poliza` ASC) VISIBLE,
  CONSTRAINT `FK_UsuarioAPago`
    FOREIGN KEY (`id_registro_poliza`)
    REFERENCES `MiSeguroDigital`.`RegistroDeUsuarioEnPoliza` (`id_registro_en_poliza`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`RegistroAudit_RegistrosPolizas`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`RegistroAudit_RegistrosPolizas` (
  `id_audit_registro` int not NULL AUTO_INCREMENT,
  `operacion_realizada` ENUM('INSERT', 'UPDATE', 'DELETE') not NULL,
  `id_registro_poliza` int not NULL,
  `id_usuario` int not NULL,
  `id_poliza` int not NULL,
  `antiguo_autorenovacion` TINYINT NULL,
  `fech_registro_antiguo` DATE NULL,
  `fecha_finalizacion_registro_antiguo` DATE NULL,
  `estatus_antiguo` ENUM('activo', 'cancelado', 'expirado') NULL,
  `fecha_cancelacion_antiguo` DATE NULL,
  `cambios_por_usuario_id` int NULL,
  `cambios_por_broker_id` int NULL,
  `fecha_de_modificacion` TIMESTAMP NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_audit_registro`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`RegistroAudit_Polizas`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`RegistroAudit_Polizas` (
  `id_audit_poliza` int not NULL AUTO_INCREMENT,
  `operacion_realizada` ENUM('INSERT', 'UPDATE', 'DELETE') not NULL,
  `id_poliza` int not NULL,
  `id_aseguradora` int not NULL,
  `antiguo_nombre_poliza` VARCHAR(255) NULL,
  `nuevo_nombre_poliza` VARCHAR(255) NULL,
  `antiguo_descripcion_poliza` TEXT NULL,
  `antiguo_pago_mensual` DECIMAL(10,2) NULL,
  `antiguo_estatus_poliza` ENUM('activa', 'pausada', 'despublicada') NULL,
  `cambios_por_broker_id` int not NULL,
  `fecha_de_modificacion` TIMESTAMP not NULL default CURRENT_TIMESTAMP,
  `antiguo_monto_cobertura_total` DECIMAL(15,2) NULL,
  `antiguo_duracion_de_contrato` int NULL,
  `antiguo_porcentaje_aprobacion` DECIMAL(5,2) NULL,
  `antiguo_importe_por_cancelacion` DECIMAL(10,2) NULL,
  `antiguo_estado_de_poliza` VARCHAR(45) NULL default 'activa',
  PRIMARY KEY (`id_audit_poliza`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`ReviewsDePolizas`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`ReviewsDePolizas` (
  `id_review` int not NULL AUTO_INCREMENT,
  `rating_del_usuario` int not NULL,
  `contexto_review` TEXT NULL,
  `tiene_hidden_fees` TINYINT not NULL default 0,
  `detalle_hidden_fees` TEXT NULL,
  PRIMARY KEY (`id_review`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`RegistroAudit_EstadoAplicacionPoliza`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`RegistroAudit_EstadoAplicacionPoliza` (
  `id_historial_aplicacion` int not NULL AUTO_INCREMENT,
  `id_aplicacion_poliza` int not NULL,
  `id_usuario` int not NULL,
  `id_poliza` int not NULL,
  `id_broker_modificador` int not NULL,
  `estado_aplicacion_antiguo` ENUM('pendiente_procesar', 'aprobada', 'rechazada') NULL,
  `razon_rechazo_broker_antigua` TEXT NULL,
  `fecha_de_modificacion` TIMESTAMP not NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial_aplicacion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Requerimientos_por_Poliza`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`Requerimientos_por_Poliza` (
  `id_requerimiento` int not NULL AUTO_INCREMENT,
  `id_poliza` int not NULL,
  `tipo_requerimiento` ENUM('registros_medicos', 'estados_de_cuenta', 'historial_crediticio', 'prueba_de_residencia', 'otro') not NULL,
  `descripcion_requerimiento` TEXT NULL,
  `requerimiento_obligatorio` TINYINT not NULL default 1,
  PRIMARY KEY (`id_requerimiento`),
  INDEX `FK_RequerimientoAPoliza_idx` (`id_poliza` ASC) VISIBLE,
  CONSTRAINT `FK_RequerimientoAPoliza`
    FOREIGN KEY (`id_poliza`)
    REFERENCES `MiSeguroDigital`.`PolizasDeSeguro` (`id_poliza`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Documentos_por_AplicacionPoliza`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`Documentos_por_AplicacionPoliza` (
  `id_documento_aplicacion` int not NULL AUTO_INCREMENT,
  `id_de_usuario_carga` int not NULL,
  `id_aplicacion_poliza` int not NULL,
  `id_requerimiento_poliza` int not NULL,
  `nombre_del_documento` VARCHAR(255) not NULL,
  `fecha_de_carga` TIMESTAMP not NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_documento_aplicacion`),
  INDEX `FK_UserToDocumentUpload_idx` (`id_de_usuario_carga` ASC) VISIBLE,
  INDEX `FK_ApplicationToDocumentUpload_idx` (`id_aplicacion_poliza` ASC) VISIBLE,
  INDEX `FK_RequirementToDocumentUpload_idx` (`id_requerimiento_poliza` ASC) VISIBLE,
  CONSTRAINT `FK_UserToDocumentUpload`
    FOREIGN KEY (`id_de_usuario_carga`)
    REFERENCES `MiSeguroDigital`.`Registro_Global_Usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ApplicationToDocumentUpload`
    FOREIGN KEY (`id_aplicacion_poliza`)
    REFERENCES `MiSeguroDigital`.`AplicacionAPoliza` (`id_aplicacion_poliza`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_RequirementToDocumentUpload`
    FOREIGN KEY (`id_requerimiento_poliza`)
    REFERENCES `MiSeguroDigital`.`Requerimientos_por_Poliza` (`id_requerimiento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Roles_Users`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`Roles_Users` (
  `id_rol_user` int not NULL AUTO_INCREMENT,
  `id_usuario` int not NULL,
  `rol_usuario` ENUM('global_superadmin', 'global_admin', 'global_user') not NULL default 'global_user',
  PRIMARY KEY (`id_rol_user`),
  INDEX `FK_usuario_a_roles_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `FK_usuario_a_roles`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `MiSeguroDigital`.`Registro_Global_Usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`RegistroAudit_AccionesUsuarios`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`RegistroAudit_AccionesUsuarios` (
  `id_audit_usuarios` int not NULL AUTO_INCREMENT,
  `id_usuario` int not NULL,
  `id_admin_modificacion` int NULL,
  `operacion_realizada` ENUM('INSERT', 'UPDATE', 'DELETE') not NULL,
  `nombre_prim_antiguo` VARCHAR(255) NULL,
  `apellido_prim_antiguo` VARCHAR(255) NULL,
  `full_nombre_usuario_antiguo` VARCHAR(512) NULL,
  `nombre_prim_nuevo` VARCHAR(255) NULL,
  `apellido_prim_nuevo` VARCHAR(255) NULL,
  `full_nombre_nuevo` VARCHAR(512) NULL,
  `numero_telefono_antiguo` VARCHAR(50) NULL,
  `numero_telefono_nuevo` VARCHAR(50) NULL,
  `fecha_nacimiento_usuario_antiguo` DATE NULL,
  `fecha_nacimiento_usuario_nuevo` DATE NULL,
  `fecha_modificacion_usuario` TIMESTAMP not NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_audit_usuarios`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`RegistroAudit_AccionesBrokers`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`RegistroAudit_AccionesBrokers` (
  `id_audit_brokers` int not NULL AUTO_INCREMENT,
  `id_broker` int not NULL,
  `id_admin_modificacion` int NULL,
  `operacion_realizada` ENUM('INSERT', 'UPDATE', 'DELETE') not NULL,
  `nombre_prim_antiguo` VARCHAR(255) NULL,
  `apellido_prim_antiguo` VARCHAR(255) NULL,
  `full_nombre_usuario_antiguo` VARCHAR(512) NULL,
  `nombre_prim_nuevo` VARCHAR(255) NULL,
  `apellido_prim_nuevo` VARCHAR(255) NULL,
  `full_nombre_nuevo` VARCHAR(512) NULL,
  `numero_telefono_antiguo` VARCHAR(50) NULL,
  `numero_telefono_nuevo` VARCHAR(50) NULL,
  `fecha_nacimiento_usuario_antiguo` DATE NULL,
  `fecha_nacimiento_usuario_nuevo` DATE NULL,
  `fecha_modificacion_usuario` TIMESTAMP not NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_audit_brokers`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`ReviewsDeUsuarios`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`ReviewsDeUsuarios` (
  `id_review_poliza` int not NULL,
  `id_usuario` int not NULL,
  `id_poliza` int not NULL,
  `fecha_creacion_review` DATE not NULL,
  PRIMARY KEY (`id_review_poliza`),
  INDEX `FK_UsersToReviewsDataStore_idx` (`id_usuario` ASC) VISIBLE,
  INDEX `FK_PolizasToReviewsDataStore_idx` (`id_poliza` ASC) VISIBLE,
  CONSTRAINT `fk_ReviewsDeUsuarios_ReviewsDePolizas1`
    FOREIGN KEY (`id_review_poliza`)
    REFERENCES `MiSeguroDigital`.`ReviewsDePolizas` (`id_review`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_UsersToReviewsDataStore`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `MiSeguroDigital`.`Registro_Global_Usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_PolizasToReviewsDataStore`
    FOREIGN KEY (`id_poliza`)
    REFERENCES `MiSeguroDigital`.`PolizasDeSeguro` (`id_poliza`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`BienesPorUsuario`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`BienesPorUsuario` (
  `id_bien` int not NULL AUTO_INCREMENT,
  `id_usuario` int not NULL,
  `valoracion_bien` DECIMAL(10,2) not NULL,
  `tipo_de_bien` ENUM('bien_inmueble', 'bien_automotriz', 'otro') not NULL,
  PRIMARY KEY (`id_bien`),
  INDEX `FK_UserToBien_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `FK_UserToBien`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `MiSeguroDigital`.`Registro_Global_Usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`BienesAseguradosPorUsuario`
-- -----------------------------------------------------
CREATE TABLE if not EXISTS `MiSeguroDigital`.`BienesAseguradosPorUsuario` (
  `id_registro_en_poliza` int not NULL,
  `id_bien_del_usuario` int not NULL,
  `fecha_asociacion_cobertura_a_bien` DATE NULL,
  PRIMARY KEY (`id_registro_en_poliza`, `id_bien_del_usuario`),
  INDEX `fk_RegistroDeUsuarioEnPoliza_has_BienesPorUsuario_BienesPor_idx` (`id_bien_del_usuario` ASC) VISIBLE,
  INDEX `fk_RegistroDeUsuarioEnPoliza_has_BienesPorUsuario_RegistroD_idx` (`id_registro_en_poliza` ASC) VISIBLE,
  CONSTRAINT `fk_RegistroDeUsuarioEnPoliza_has_BienesPorUsuario_RegistroDeU1`
    FOREIGN KEY (`id_registro_en_poliza`)
    REFERENCES `MiSeguroDigital`.`RegistroDeUsuarioEnPoliza` (`id_registro_en_poliza`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_RegistroDeUsuarioEnPoliza_has_BienesPorUsuario_BienesPorUs1`
    FOREIGN KEY (`id_bien_del_usuario`)
    REFERENCES `MiSeguroDigital`.`BienesPorUsuario` (`id_bien`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


set SQL_MODE=@OLD_SQL_MODE;
set FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
set UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- ? Crea una nueva solicitud de poliza para un usuario y
-- ? la registra con estado 'pendiente_procesar'

DELIMITER $$
create procedure crearAplicacionEnPolizaPorUsuario(
    in usuarioId int,
    in polizaId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables para validar existencia
    declare usuarioExiste int default 0;
    declare polizaExiste int default 0;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado como exitoso
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar existencia del usuario
    select count(*) into usuarioExiste 
    from Registro_Global_Usuarios where id_usuario = usuarioId;

    -- ? Verificar que la poliza existe y esta activa
    select count(*) into polizaExiste 
    from PolizasDeSeguro where id_poliza = polizaId 
    and estado_de_poliza = 'activa';

    -- ? Validar existencia de usuario y poliza
    if usuarioExiste = 0 then
        set codigoResultado = 404;  -- Usuario no encontrado
        rollback;
    elseif polizaExiste = 0 then
        set codigoResultado = 404; -- Poliza no existe
        rollback;
    else
        -- ? ? Insertar nuevo registro de aplicacion
        insert into aplicacionapoliza (
            id_usuario,
            id_poliza,
            fecha_de_aplicacion,
            estado_actual_aplicacion
        ) values (
            usuarioId,
            polizaId,
            now(),
            'pendiente_procesar'
        );

        commit;
    end if;
end$$
DELIMITER ;
-- ? Permite que un analista apruebe o rechace una solicitud de poliza
-- ? Cambia el estado de la aplicacion y registra la decision en auditoria

DELIMITER $$
create procedure procesarAplicacionEnPolizaPorUsuario(
    in aplicacionId int,
    in brokerAnalistaId int,
    in decision enum('aprobada', 'rechazada'),
    in razonRechazo text,
    out codigoResultado int
)
begin
    -- ? Declarar variables para datos de la aplicacion
    declare estadoActual enum('pendiente_procesar', 'aprobada', 'rechazada');
    declare usuarioId int;
    declare polizaId int;

    -- ? Handler  de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500; -- Declara un exit handler con error code 500
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200; -- Asumimos que ess posible retornar 200 como codigo

    start transaction;

    -- ? Verificar existencia de aplicacion y obtener datos actuales
    select estado_actual_aplicacion, id_usuario, id_poliza
    into   estadoActual, usuarioId, polizaId
    from   AplicacionAPoliza
    where  id_aplicacion_poliza = aplicacionId;

    -- ? Validar que la aplicacion existe y esta pendiente
    if usuarioId is null then
        set codigoResultado = 404; -- No se ha encontrado un rgistro basado en el Id de Aplicacion  (stale data?)
        rollback;
    elseif estadoActual != 'pendiente_procesar' then
        set codigoResultado = 409; -- Si ya no es pendiente procesar no es necesario procesar de nuevo
        rollback;
    else
        -- ? Actualizar estado de la aplicacion
        update AplicacionAPoliza
        set    estado_actual_aplicacion = decision,
               id_broker_que_reviso = brokerAnalistaId,
               razon_de_rechazo = razonRechazo
        where  id_aplicacion_poliza = aplicacionId;

        -- ? Registrar decision en auditoria
        insert into RegistroAudit_EstadoAplicacionPoliza (
            id_aplicacion_poliza,
            id_usuario,
            id_poliza,
            id_broker_modificador,
            estado_aplicacion_antiguo,
            razon_rechazo_broker_antigua,
            fecha_de_modificacion
        ) values (
            aplicacionId,
            usuarioId,
            polizaId,
            brokerAnalistaId,
            estadoActual,
            razonRechazo,
            now()
        );

        commit;
    end if;
end$$
DELIMITER ;
-- ? Registra formalmente a un usuario en una poliza despues de la aprobacion y
-- ? crea el registro en RegistroDeUsuarioEnPoliza que ancla pagos y comentarios en la data

DELIMITER $$
create procedure registrarUsuarioEnPolizaPorAplicacion(
    in aplicacionPolizaId int,
    in adminId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables para datos de la aplicacion
    declare estadoAplicacion enum('pendiente_procesar', 'aprobada', 'rechazada');
    declare usuarioId int;
    declare polizaId int;
    declare duracionContrato int;
    declare registroExistente int default 0;
    declare fechaInicio date;
    declare fechaFin date;

    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar que la aplicacion existe y esta aprobada
    select estado_actual_aplicacion, id_usuario, id_poliza
    into   estadoAplicacion, usuarioId, polizaId
    from   AplicacionAPoliza
    where  id_aplicacion_poliza = aplicacionPolizaId;

    if estadoAplicacion is null then
        set codigoResultado = 404; -- No exise una aplicacion en base al id de Aplicacion
        rollback;
    elseif estadoAplicacion != 'aprobada' then
        set codigoResultado = 409; -- La solicitud no esta aprobada y no se puede continuar
        rollback;
    else
        -- ? Verificar que no existe registro activo para este usuario y poliza
        select count(*) into registroExistente
        from   RegistroDeUsuarioEnPoliza
        where  id_usuario = usuarioId
            and estado_de_registro = 'registro_activo'
            and id_poliza = polizaId
            and estado_de_registro = 'registro_activo';

        if registroExistente > 0 then
            set codigoResultado = 409; -- Si tenemos un registro a la salida, el conteno es mayor que el default
            -- Si estamos aqui el problema es que hubo un registro actual already, por lo que
            -- frenamos el proceso de nuevo.
            rollback;
        else
            -- ? Obtener duracion del contrato para calcular fecha de finalizacion
            select duracion_de_contrato into duracionContrato
            from   PolizasDeSeguro
            where  id_poliza = polizaId;

            set fechaInicio = curdate();
            -- ? Este segundo calculo es importante, dado que nos permite calcular el intervalo en
            -- ? meses dado que contabilizamos la fecha de ingreso yfinal de la poliza con DATE
            set fechaFin = date_add(fechaInicio, interval duracionContrato month);

            -- ? Insertar nuevo registro en tabla de polizas de usuario
            insert into RegistroDeUsuarioEnPoliza (
                id_poliza,
                id_usuario,
                id_aplicacion_a_poliza,
                fecha_inicio_registro,
                fecha_finalizacion_registro,
                estado_de_registro
            ) values (
                polizaId,
                usuarioId,
                aplicacionPolizaId,
                fechaInicio,
                fechaFin,
                'registro_activo'
            );

            -- ? Registrar accion en auditoria
            insert into RegistroAudit_RegistrosPolizas (
                operacion_realizada,
                id_registro_poliza,
                id_usuario,
                id_poliza,
                cambios_por_usuario_id,
                fecha_de_modificacion
            ) values (
                'INSERT',
                last_insert_id(),
                usuarioId,
                polizaId,
                adminId,
                now()
            );

            commit;
        end if;
    end if;
end$$
DELIMITER ;
-- ? Vista para ver los detalles completos de una solicitud
-- ? Incluye informacion del usuario, de la poliza y de los documentos/requisitos

DELIMITER $$
create or replace view viewDetallesDeAplicacionPorUsuarios as
select
    -- ? Informacion de la aplicacion
    polizaAplicacion.id_aplicacion_poliza,
    polizaAplicacion.fecha_de_aplicacion,
    polizaAplicacion.estado_actual_aplicacion,
    -- ? Informacion del usuario
    registro_usuarios.id_usuario,
    registro_usuarios.full_nombre_usuario,
    registro_identidad.correo_registro,
    registro_usuarios.numero_telefono_usuario,
    registro_usuarios.fecha_nacimiento_usuario,
    -- ? Informacion de la poliza
    polizas.id_poliza,
    polizas.nombre_de_la_poliza,
    polizas.descripcion_de_la_poliza,
    polizas.pago_mensual,
    polizas.monto_cobertura_total,
    -- ? Informacion de la aseguradora
    aseguradoras.nombre_aseguradora,
    -- ? Informacion de los requisitos y documentos
    IFNULL(doc_count.cantidad_documentos, 0) AS cantidad_documentos
from
    AplicacionAPoliza polizaAplicacion
    -- ? Joins para obtener datos de usuario y poliza
    join Registro_Global_Usuarios registro_usuarios
        on polizaAplicacion.id_usuario = registro_usuarios.id_usuario
    join Registro_SignUp_Global registro_identidad
        on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
    join PolizasDeSeguro polizas
        on polizaAplicacion.id_poliza = polizas.id_poliza
    join Aseguradoras aseguradoras
        on polizas.id_aseguradora = aseguradoras.id_aseguradora
    -- ? Left Join con documentos y requisitos. En este caso,puede que para la aplcacino
    -- especifica no se haya subid archivos. En este caso usamos left join para que se muestre
    -- la aplicacion sin importar qye haya o no documentos. La subquery interna nos permite
    -- obtener el conteno de documentos de la poliza si fueron registrados, esto elimina
    -- varios registros por tener varios documentos.
    left join (
        select
            id_aplicacion_poliza,
            COUNT(*) as cantidad_documentos
        from
            Documentos_por_AplicacionPoliza
        Group by
            id_aplicacion_poliza
    ) doc_count
        on polizaAplicacion.id_aplicacion_poliza = doc_count.id_aplicacion_poliza
ORDER BY
    polizaAplicacion.fecha_de_aplicacion DESC$$
DELIMITER ;
-- ? Vista para que los analistas de broker vean las solicitudes pendientes
-- ? Muestra las solicitudes asociadas a las polizas de su aseguradora

DELIMITER $$
create or replace view viewAplicacionesPendientesPorBroker as
select
    -- ? Informacion de la aplicacion
    aplicacionPoliza.id_aplicacion_poliza,
    aplicacionPoliza.fecha_de_aplicacion,
    aplicacionPoliza.estado_actual_aplicacion,
    -- ? Informacion del usuario que aplica
    registro_usuarios.id_usuario,
    registro_usuarios.full_nombre_usuario,
    registro_identidad.correo_registro as email_usuario,
    -- ? Informacion de la poliza
    polizas.id_poliza,
    polizas.nombre_de_la_poliza,
    -- ? Informacion de la aseguradora para filtrado
    aseguradoras.id_aseguradora,
    aseguradoras.nombre_aseguradora
from
    AplicacionAPoliza aplicacionPoliza
    -- ? Unir con usuarios para obtener su informacion
    join Registro_Global_Usuarios registro_usuarios
        on aplicacionPoliza.id_usuario = registro_usuarios.id_usuario
    join Registro_SignUp_Global registro_identidad
        on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
    -- ? Unir con polizas para obtener su informacion
    join PolizasDeSeguro polizas
        on aplicacionPoliza.id_poliza = polizas.id_poliza
    -- ? Unir con aseguradoras para filtrar por broker
    join Aseguradoras aseguradoras
        on polizas.id_aseguradora = aseguradoras.id_aseguradora
where
    -- ? Mostrar solo las que estan pendientes de procesar
    aplicacionPoliza.estado_actual_aplicacion = 'pendiente_procesar'
order by
    -- ? Ordenar por fecha de aplicacion ascendente para procesar las mas antiguas primero
    aplicacionPoliza.fecha_de_aplicacion asc$$
DELIMITER ;
-- ? Vista para generar estadisticas de solicitudes para los reportes del broker
-- ? Calcula el total de solicitudes aprobadas, rechazadas y pendientes

DELIMITER $$
create or replace view viewEstadisticasDeSolicitudesReporteParaBrokers as
select
    -- ? Agrupar por aseguradora para reportes especificos del broker
    poliza.id_aseguradora,
    aseguradora.nombre_aseguradora,
    -- ? Contar el total de aplicaciones
    count(aplicacionPoliza.id_aplicacion_poliza) as total_aplicaciones,
    -- ? Contar las aplicaciones pendientes
    sum(case
        when aplicacionPoliza.estado_actual_aplicacion = 'pendiente_procesar'
            then 1 else 0 end) as aplicaciones_pendientes,
    -- ? Contar las aplicaciones aprobadas
    sum(case
        when aplicacionPoliza.estado_actual_aplicacion = 'aprobada'
            then 1 else 0 end) as aplicaciones_aprobadas,
    -- ? Contar las aplicaciones rechazadas
    sum(case
        when aplicacionPoliza.estado_actual_aplicacion = 'rechazada'
            then 1 else 0 end) as aplicaciones_rechazadas
from
    AplicacionAPoliza aplicacionPoliza
    -- ? Unir con polizas para poder agrupar por aseguradora
    join PolizasDeSeguro poliza
        on aplicacionPoliza.id_poliza = poliza.id_poliza
    join Aseguradoras aseguradora
        on poliza.id_aseguradora = aseguradora.id_aseguradora
group by
    -- ? Agrupar los conteos por aseguradora
    poliza.id_aseguradora$$
DELIMITER ;
-- ? Vista para que un usuario vea sus solicitudes de poliza
-- ? Muestra el historial de solicitudes de un usuario especifico

DELIMITER $$
create or replace view viewAplicacionesPolizaPorUsuario as
select
    -- ? Informacion del usuario
    registro_usuarios.id_usuario,
    -- ? Informacion de la aplicacion
    aplicacionPoliza.id_aplicacion_poliza,
    aplicacionPoliza.fecha_de_aplicacion,
    aplicacionPoliza.estado_actual_aplicacion,
    -- ? Informacion de la poliza
    polizas.nombre_de_la_poliza,
    polizas.tipo_de_poliza,
    -- ? Informacion de la aseguradora
    aseguradora.nombre_aseguradora
from
    AplicacionAPoliza aplicacionPoliza
    -- ? Unir con la tabla de usuarios para obtener el ID del usuario
    join Registro_Global_Usuarios registro_usuarios
        on aplicacionPoliza.id_usuario = registro_usuarios.id_usuario
    -- ? Unir con la tabla de polizas para obtener el nombre de la poliza
    join PolizasDeSeguro polizas
        on aplicacionPoliza.id_poliza = polizas.id_poliza
    -- ? Unir con la tabla de aseguradoras para obtener el nombre de la aseguradora
    join Aseguradoras aseguradora
        on polizas.id_aseguradora = aseguradora.id_aseguradora
order by
    -- ? Ordenar por fecha de aplicacion descendente
    aplicacionPoliza.fecha_de_aplicacion desc$$

DELIMITER ;

-- ? Stored Procedure para obtener los datos del broker en base a su ID
DELIMITER $$
create procedure getBrokerDataPerBrokerID(
    in BrokerId int,
    out ResultCode int
)
begin
    -- ?  Variables de control
    declare BrokerExists int default 0;
    declare ExitHandlerCalled boolean default false;
    
    -- ? Handler para capturar errores SQL
    declare exit handler for sqlexception
    begin
        set ExitHandlerCalled = true;
        set ResultCode = 500;
    end;
    
    -- ?  Inicializar codigo de resultado
    set ResultCode = 200;
    
    -- ?  Verificar si el broker existe
    select
        count(*)
    into BrokerExists
    from Registro_Global_Brokers registro_brokers
    join Registro_SignUp_Global registro_identidad
        on registro_brokers.id_identidad_registro = registro_identidad.id_identidad
    where registro_brokers.id_broker = BrokerId
        and registro_identidad.estado_actividad_registro = 'activo';
    
    -- ? 8. Si broker no existe, retornar error
    if BrokerExists = 0 then
        set ResultCode = 404;
        select 'Broker no encontrado' as mensaje;
    else
        -- ? 9. Retornar datos del broker
        select 
            registro_broker.id_broker,
            registro_identidad.correo_registro as email,
            registro_broker.nombre_prim_broker,
            registro_broker.apellido_prim_broker,
            registro_broker.full_nombre_broker,
            registro_broker.numero_telefono_broker,
            registro_broker.fecha_nacimiento_broker,
            registro_broker.estado_broker,
            registro_identidad.estado_actividad_registro as is_active,
            registro_identidad.fecha_registro as created_at,
            aseguradora.id_aseguradora,
            aseguradora.nombre_aseguradora,
            aseguradora.dominio_correo_aseguradora,
            roles_brokers.rol_broker as broker_role
        from Registro_Global_Brokers registro_broker
        inner join Registro_SignUp_Global registro_identidad on registro_broker.id_identidad_registro = registro_identidad.id_identidad
        inner join Aseguradoras aseguradora on registro_broker.id_aseguradora = aseguradora.id_aseguradora
        left join Roles_Broker roles_brokers on registro_broker.id_broker = roles_brokers.id_broker
        where registro_broker.id_broker = BrokerId;
    end if;
end$$

-- ? Aprueba o rechaza solicitudes de broker
-- ? Cambia estado y asigna rol inicial si es aprobado
-- ? Registra quien tomo la decision en auditoria

create procedure aprobarORechazarBrokerManual(
    in brokerId int,
    in accion enum('aprobar', 'rechazar'),
    in rolInicial enum('broker_superadmin', 'broker_admin', 'broker_analyst'),
    in adminId int,
    out codigoResultado int
)
begin
    -- ? Declarar variables de control
    declare brokerExiste int default 0;
    declare estadoActual varchar(50);
    declare nuevoEstado varchar(50);
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500; --  Enviamos error 5xx de servidor!
        rollback;
    end;
    
    -- ? Inicializar resultado
    set codigoResultado = 200; -- Asumimos que hasta este punto podemos enviar
    -- un estado 2xx
    
    start transaction;
    
    -- ? Verificar existencia y estado actual del broker
    select estado_broker, 1
        into   estadoActual, brokerExiste
    from   Registro_Global_Brokers registro_brokers
    join Registro_SignUp_Global registro_identidad
        on registro_brokers.id_identidad_registro = registro_identidad.id_identidad
    where  registro_brokers.id_broker = brokerId
        and registro_identidad.estado_actividad_registro = 'activo';
    
    -- ? Validar existencia del broker
    if brokerExiste = 0 then
        set codigoResultado = 404;
        rollback;
    elseif estadoActual != 'pendiente' then
        set codigoResultado = 409;
        rollback;
    else
        -- ? Determinar nuevo estado segun accion
        if accion = 'aprobar' then
            set nuevoEstado = 'activo';
        else
            set nuevoEstado = 'rechazado';
        end if;
        
        -- ? Actualizar estado del broker
        update Registro_Global_Brokers 
        set    estado_broker = nuevoEstado
        where  id_broker = brokerId;
        
        -- ? Si fue aprobado, asignar rol inicial
        if accion = 'aprobar' then
            insert into Roles_Broker (
                id_broker,
                rol_broker
            ) values (
                brokerId,
                rolInicial
            );
        end if;
        
        -- ? Registrar decision en auditoria
        insert into RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            fecha_modificacion_usuario
        ) values (
            brokerId,
            adminId,
            'UPDATE',
            now()
        );
        
        commit;
    end if;
end$$
DELIMITER ;

-- ? Crea broker manualmente por Global Admin
-- ? Incluye validaciones de email unico y aseguradora valida
-- ? Crea regfstro completo y asigna rol inicial

DELIMITER $$
create procedure crearBrokerManual(
    in email varchar(255),
    in passwordHash varchar(512),
    in passwordSalt varchar(512),
    in nombrePrim varchar(255),
    in apellidoPrim varchar(255),
    in fullNombre varchar(512),
    in telefono varchar(50),
    in fechaNacimiento date,
    in aseguradoraId int,
    in estadoInicial enum('pendiente', 'activo', 'rechazado'),
    in rolInicial enum('broker_superadmin', 'broker_admin', 'broker_analyst'),
    in adminId int,
    out codigoResultado int,
    out nuevoBrokerId int
)
begin
    -- ? Declarar variables para control de flujo
    declare emailCount int default 0;
    declare aseguradoraExiste int default 0;
    declare identityId int default 0;
    declare brokerId int default 0;
    
    -- ? Handler de errores SQL
    declare exit handler for sqlexception
    begin
        set codigoResultado = 500;
        rollback;
    end;
    
    -- ? Inicializar resultados
    set codigoResultado = 200;
    set nuevoBrokerId = 0;
    
    start transaction;
    
    -- ? Verificar email unico
    select count(*) into emailCount 
    from   Registro_SignUp_Global 
    where  correo_registro = email;
    
    -- ? Verificar que aseguradora existe
    select count(*) into aseguradoraExiste
    from   Aseguradoras
    where  id_aseguradora = aseguradoraId;
    
    -- ? Validar email unico
    if emailCount > 0 then
        set codigoResultado = 409;   -- ?   Correo de registro ya existe
        rollback;
    elseif aseguradoraExiste = 0 then
        set codigoResultado = 404; -- ? Aseguradora no existe
        rollback;
    else
        -- ? Crear registro principal
        insert into Registro_SignUp_Global (
            correo_registro,
            hashed_pwd_registro,
            hashed_pwd_salt_registro,
            estado_actividad_registro,
            fecha_registro
        ) values (
            email,
            passwordHash,
            passwordSalt,
            'activo',
            now()
        );
        
        set identityId = last_insert_id();
        
        -- ? Crear registro de broker
        insert into Registro_Global_Brokers (
            id_identidad_registro,
            id_aseguradora,
            nombre_prim_broker,
            apellido_prim_broker,
            full_nombre_broker,
            numero_telefono_broker,
            fecha_nacimiento_broker,
            estado_broker
        ) values (
            identityId,
            aseguradoraId,
            nombrePrim,
            apellidoPrim,
            fullNombre,
            telefono,
            fechaNacimiento,
            estadoInicial
        );
        
        set brokerId = last_insert_id();
        set nuevoBrokerId = brokerId;
        
        -- ? Asignar rol si el estado es activo
        if estadoInicial = 'activo' then
            insert into Roles_Broker (
                id_broker,
                rol_broker
            ) values (
                brokerId,
                rolInicial
            );
        end if;
        
        -- ? Registrar en auditoria
        insert into RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            nombre_prim_nuevo,
            apellido_prim_nuevo,
            full_nombre_nuevo,
            numero_telefono_nuevo,
            fecha_nacimiento_usuario_nuevo,
            fecha_modificacion_usuario
        ) values (
            brokerId,
            adminId,
            'INSERT',
            nombrePrim,
            apellidoPrim,
            fullNombre,
            telefono,
            fechaNacimiento,
            now()
        );
        
        commit;
    end if;
end$$
DELIMITER ;
-- Elimina broker manualmente por Global Admin
-- Implementa soft delete cambiando estado de registro
-- Limpia roles asociados y registra en auditoria

DELIMITER $$
create procedure eliminarBrokerManual$$
DELIMITER ;
    
    -- Inicializar resultado
    set codigoResultado = 200;
    
    start transaction;
    
    -- Verificar existencia del broker y obtener identity_id
    select id_identidad_registro, 1
        into   identityId, brokerExiste
    from   Registro_Global_Brokers registro_brokers
    join Registro_SignUp_Global registro_identidad
        on registro_brokers.id_identidad_registro = registro_identidad.id_identidad
    where  registro_brokers.id_broker = brokerId
        and registro_identidad.estado_actividad_registro = 'activo';
    
    -- Si broker no existe o ya esta inactivo
    if brokerExiste = 0 then
        set codigoResultado = 404;
        rollback;
    else
        -- Eliminar roles del broker si existen
        delete from Roles_Broker 
        where  id_broker = brokerId;
        
        -- Soft delete del registro principal
        update Registro_SignUp_Global 
        set    estado_actividad_registro = 'inactivo'
        where  id_identidad = identityId;
        
        -- Registrar eliminacion en auditoria
        insert into RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            fecha_modificacion_usuario
        ) values (
            brokerId,
            adminId,
            'DELETE',
            now()
        );
        
        commit;
    end if;
end;
-- ? Actualiza broker manualmente por Global Admin
-- ? Permite cambio de informacion personal y estado del broker
-- ? Maneja asignacion y cambio de roles segun estado

DELIMITER $$
create procedure actualizarBrokerManual$$
DELIMITER ;
    
    -- ? Inicializar resultado
    set codigoResultado = 200; -- Retornamos vlaor de 2xx asumiendo que la ejecucion
    -- paso sin errores.
    
    start transaction;
    
    -- ? Verificar existencia y obtener valores actuales
    select
        nombre_prim_broker,
        apellido_prim_broker,
        full_nombre_broker,
        numero_telefono_broker,
        fecha_nacimiento_broker,
        estado_broker,
        1
    into
        oldNombre,
        oldApellido,
        oldFullNombre,
        oldTelefono,
        oldFechaNacimiento,
        oldEstado,
        brokerExiste
    from   Registro_Global_Brokers 
    where  id_broker = brokerId;
    
    -- ? Verificar si broker no existe
    if brokerExiste = 0 then
        set codigoResultado = 404; -- No obtuvimos un id de salida y por tanto no existe.
        rollback;
    else
        -- ? Actualizar informacion del broker
        update Registro_Global_Brokers 
        set
            nombre_prim_broker = nombrePrim,
            apellido_prim_broker = apellidoPrim,
            full_nombre_broker = fullNombre,
            numero_telefono_broker = telefono,
            fecha_nacimiento_broker = fechaNacimiento,
            estado_broker = estadoBroker
        where  id_broker = brokerId;
        
        -- ? Verificar si ya tiene rol asignado
        select count(*) into tieneRol
        from   Roles_Broker
        where  id_broker = brokerId;
        
        -- ? Manejar roles segun estado
        if estadoBroker = 'activo' then
            -- ? Si esta activo, asegurar que tenga rol
            if tieneRol = 0 then
                insert into Roles_Broker (id_broker, rol_broker)
                values (brokerId, rolBroker);
            else
                update Roles_Broker 
                set    rol_broker = rolBroker
                where  id_broker = brokerId;
            end if;
        elseif estadoBroker in ('pendiente', 'rechazado') and tieneRol > 0 then
            -- ? Si no esta activo, remover rol si existe. En este caso, si
            -- el broker tiene un rol, y el  estado del broker paso hacia pendiente
            -- o rechazado, entonces eliminamos el registro anterior de roles.

            -- Para el manejo de esta sentencia, usaremos la nocion en el BE API que
            -- tenemos que evitar el caso de actualizacion de la misma data del usuario aqui
            delete from Roles_Broker where id_broker = brokerId;
        end if;
        
        -- ? Registrar cambios en auditoria
        insert into RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            nombre_prim_antiguo,
            apellido_prim_antiguo,
            full_nombre_usuario_antiguo,
            numero_telefono_antiguo,
            fecha_nacimiento_usuario_antiguo,
            nombre_prim_nuevo,
            apellido_prim_nuevo,
            full_nombre_nuevo,
            numero_telefono_nuevo,
            fecha_nacimiento_usuario_nuevo,
            fecha_modificacion_usuario
        ) values (
            brokerId,
            adminId,
            'UPDATE',
            oldNombre,
            oldApellido,
            oldFullNombre,
            oldTelefono,
            oldFechaNacimiento,
            nombrePrim,
            apellidoPrim,
            fullNombre,
            telefono,
            fechaNacimiento,
            now()
        );
        
        commit;
    end if;
end;
-- ? Vista para mostrar brokers con informacion consolidada
-- ? Une tablas de registro, brokers, aseguradoras y roles
-- ? Muestra solo brokers activos para administracion

DELIMITER $$
create or replace view viewBrokerInfoBasica as$$
DELIMITER ;
-- ? Vista para mostrar brokers agrupados por estado
-- ? Facilita revision de solicitudes pendientes y gestion
-- ? Incluye informacion de aseguradora para contexto

DELIMITER $$
create or replace view viewBrokersAgrupadosPorEstadoBroker as$$
DELIMITER ;
-- ? Obtiene todos los comentarios de una poliza especifica
-- ? Devuelve informacion del comentario y del usuario que lo creo

DELIMITER $$
create procedure obtenerComentariosPorIDPoliza$$
DELIMITER ;
-- ? Permite que un administrador elimine cualquier comentario
-- ? Realiza borrado fisico del comentario y su vinculo

DELIMITER $$
create procedure eliminarComentarioPorAdmin$$
DELIMITER ;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar que el review existe
    select count(*)
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
-- ? Permite que un usuario cree un nuevo comentario para una poliza
-- ? Valida que el usuario este registrado activamente en la poliza

DELIMITER $$
create procedure crearComentarioPolizaPorUsuario$$
DELIMITER ;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;
    set nuevoReviewId = 0;

    start transaction;

    -- ? Validar que el usuario tiene registro activo para esta poliza
    select count(*)
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
-- ? Permite que un usuario edite su propio comentario
-- ? Valida que el usuario que edita es el autor original del comentario

DELIMITER $$
create procedure editarComentarioPorUsuario$$
DELIMITER ;

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
-- ? Obtiene el historial de pagos de un usuario para una poliza registrada
-- ? Devuelve todos los pagos asociados a un registro de poliza

DELIMITER $$
create procedure obtenerPagosRealizadosPorUsuario$$
DELIMITER ;
-- ? Registra un nuevo pago asociado a una poliza
-- ? Valida que el registro del usuario en la poliza este activo

DELIMITER $$
create procedure crearRegistroPagoPolizaPorUsuario$$
DELIMITER ;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;
    set nuevoPagoId = 0;

    start transaction;

    -- ? Validar que el registro de poliza existe y esta activo
    select
        count(*)
    into registroActivoExiste
    from   RegistroDeUsuarioEnPoliza
    where  id_registro_en_poliza = registroPolizaId
      and estado_de_registro = 'registro_activo';

    if registroActivoExiste = 0 then
        set codigoResultado = 404; --  No existe la poliza o no esta activa si existe
        -- EN este caso,no sepuede realisar modificaciones por tanto 404 not found
        -- para ser un catch-all del error
        rollback;
    else
        -- ? Insertar nuevo pago
        insert into PagosPorPoliza (
            id_registro_poliza,
            cantidad_pago,
            metodo_de_pago,
            estado_del_pago,
            motivo_del_pago,
            fecha_de_pago
        ) values (
            registroPolizaId,
            cantidadPago,
            metodoPago,
            'completado',
            motivoPago,
            now()
        );

        set nuevoPagoId = last_insert_id();

        commit;
    end if;
end;
-- ? Procedimientos para buscar polizas por diferentes criterios
-- ? Permite buscar por aseguradora, tipo de poliza y nombre con coincidencias parciales
-- ? En esta implementacion, la idea es usar procedures para que la busqueda no tenga un retorno
-- ? sino solo ejecute un wrapper alredeodr de una  consulta estandar para poder retornar un
-- ? result set completo.

-- ? Busca polizas registradas para una aseguradora especifica
DELIMITER $$
create procedure buscarPolizaPorAseguradora$$
DELIMITER ;

-- ? Busca polizas por tipo especifico
DELIMITER $$
create procedure buscarPolizaPorTipo$$
DELIMITER ;

-- ? Busca polizas por nombre usando coincidencias parciales con LIKE
DELIMITER $$
create procedure buscarPolizaPorNombreParcial$$
DELIMITER ;
-- ? Actualiza un requisito existente de una poliza
-- ? Permite cambiar los detalles de un requerimiento especifico

DELIMITER $$
create procedure actualizarRequisitosDeUnaPoliza$$
DELIMITER ;

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
-- ? Agrega un requisito a una poliza
-- ? Crea un nuevo registro en la tabla de requerimientos para una poliza especifica

DELIMITER $$
create procedure agregarRequsitisoParaPolizas$$
DELIMITER ;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar si la poliza existe
    select
        count(*)
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
-- ? Crea poliza por Admin Broker
-- ? Valida aseguradora y crea registro con auditoria
-- ? Solo admins pueden crear polizas nuevas

DELIMITER $$
create procedure crearPolizaPorBrokerAdmin$$
DELIMITER ;
    
    -- ? Inicializar resultados, definimos el codigo de resutado genrralmente as 2xx, en este caso 200 para indicar
    --  estado OK en la respuesta de la API.
    set codigoResultado = 200;
    set nuevaPolizaId = 0;
    
    start transaction;
    
    -- ? Verificar que aseguradora existe
    select
        count(*)
    into aseguradoraExiste
    from   Aseguradoras
    where  id_aseguradora = aseguradoraId;
    
    -- ? Validar aseguradora existe
    if aseguradoraExiste = 0 then
        set codigoResultado = 404; -- Si no existe la aseguradora, entonces tenemos el registro como cero,porque
        -- el select va areotrnar nada. Entonces, al final retornamos 404 para un catch-all de no encontrar la aseguradora
        rollback;
    else
        -- ? Crear la poliza
        insert into PolizasDeSeguro (
            id_aseguradora,
            nombre_de_la_poliza,
            descripcion_de_la_poliza,
            tipo_de_poliza,
            pago_mensual,
            monto_cobertura_total,
            duracion_de_contrato,
            porcentaje_de_aprobacion,
            importe_por_cancelacion,
            estado_de_poliza
        ) values (
            aseguradoraId,
            nombrePoliza,
            descripcion,
            tipoPoliza,
            pagoMensual,
            montoCobertura,
            duracionContrato,
            porcentajeAprobacion,
            importeCancelacion,
            estadoInicial
        );
        
        set polizaId = last_insert_id();
        set nuevaPolizaId = polizaId;
        
        -- ? Registrar creacion en auditoria
        insert into RegistroAudit_Polizas (
            operacion_realizada,
            id_poliza,
            id_aseguradora,
            nuevo_nombre_poliza,
            cambios_por_broker_id,
            fecha_de_modificacion
        ) values (
            'INSERT',
            polizaId,
            aseguradoraId,
            nombrePoliza,
            brokerId,
            now()
        );
        
        commit;
    end if;
end;
-- ? Elimina poliza por Admin Broker
-- ? Implementa soft delete cambiando estado a despublicada
-- ? Verifica que no tenga registros activos antes de eliminar

DELIMITER $$
create procedure eliminarPolizaPorAdminBroker$$
DELIMITER ;
    
    -- ? Inicializar resultado
    set codigoResultado = 200;
    
    start transaction;
    
    -- ? Verificar existencia de poliza y obtener datos
    select
        id_aseguradora,
        estado_de_poliza,
        1
    into
        aseguradoraId,
        oldEstado,
        polizaExiste -- Aqui se usa 1 si la poliza existe y 0 si no, entonces si al final seguimos en cero es que este
    -- select no encontro nada y se mantiene en cero.
    from   PolizasDeSeguro 
    where  id_poliza = polizaId;
    
    -- ? Validar existencia de poliza
    if polizaExiste = 0 then
        set codigoResultado = 404; -- Retornamos 404 porque no se encontro la poliza en la base de datos
        rollback;
    else
        -- ? Verificar si tiene registros activos
        select
            count(*)
        into registrosActivos
        from   RegistroDeUsuarioEnPoliza
        where  id_poliza = polizaId
          and estado_de_registro = 'registro_activo';
        
        -- ? Si tiene registros activos, no permitir eliminacion
        if registrosActivos > 0 then
            set codigoResultado = 409; -- Retornamos 409 para responder al problema de que existen registros
            -- por tanto no se puede eliminar nada
            rollback;
        else
            -- ? Soft delete cambiando estado a despublicada
            update PolizasDeSeguro 
            set    estado_de_poliza = 'despublicada'
            where  id_poliza = polizaId;
            
            -- ? Registrar eliminacion en auditoria
            insert into RegistroAudit_Polizas (
                operacion_realizada,
                id_poliza,
                id_aseguradora,
                antiguo_estatus_poliza,
                cambios_por_broker_id,
                fecha_de_modificacion
            ) values (
                'DELETE',
                polizaId,
                aseguradoraId,
                oldEstado,
                brokerId,
                now()
            );
            
            commit;
        end if;
    end if;
end;
-- ? Elimina un requisito de una poliza
-- de la tabla de requerimientos

DELIMITER $$
create procedure eliminarRequisitoPolizaPorAdmin$$
DELIMITER ;

    -- ? Inicializar codigo de resultado
    set codigoResultado = 200;

    start transaction;

    -- ? Verificar si el requerimiento existe
    select
        count(*)
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
-- ? Actualiza poliza por Admin Broker
-- ? Registra valores anteriores y nuevos en auditoria
-- ? Valida existencia de poliza antes de actualizar

DELIMITER $$
create procedure actualizarPolizaPorAdmin$$
DELIMITER ;
    
    -- ? Inicializar resultado
    set codigoResultado = 200;
    
    start transaction;
    
    -- ? Verificar existencia y obtener valores actuales
    select
        nombre_de_la_poliza,
        descripcion_de_la_poliza,
        pago_mensual,
        estado_de_poliza,
        monto_cobertura_total,
        duracion_de_contrato,
        porcentaje_de_aprobacion,
        importe_por_cancelacion,
        id_aseguradora,
        1
    into
        oldNombre,
        oldDescripcion,
        oldPagoMensual,
        oldEstado,
        oldMontoCobertura,
        oldDuracion,
        oldPorcentaje,
        oldImporte,
        aseguradoraId,
        polizaExiste
    from   PolizasDeSeguro 
    where  id_poliza = polizaId;
    
    -- ? Validar existencia de poliza
    if polizaExiste = 0 then
        set codigoResultado = 404; -- Si no encontramos la poliza al seleccionar sus componentes, es decir
        -- el valor de polizaExiste escero entonces retornamos directamente un 404 y hacemos un rollback
        rollback;
    else
        -- ? Actualizar la poliza
        update PolizasDeSeguro 
        set    nombre_de_la_poliza = nombrePoliza,
               descripcion_de_la_poliza = descripcion,
               tipo_de_poliza = tipoPoliza,
               pago_mensual = pagoMensual,
               monto_cobertura_total = montoCobertura,
               duracion_de_contrato = duracionContrato,
               porcentaje_de_aprobacion = porcentajeAprobacion,
               importe_por_cancelacion = importeCancelacion,
               estado_de_poliza = estadoPoliza
        where  id_poliza = polizaId;
        
        -- ? Registrar cambios en auditoria
        insert into RegistroAudit_Polizas (
            operacion_realizada,
            id_poliza,
            id_aseguradora,
            antiguo_nombre_poliza,
            nuevo_nombre_poliza,
            antiguo_descripcion_poliza,
            antiguo_pago_mensual,
            antiguo_estatus_poliza,
            antiguo_monto_cobertura_total,
            antiguo_porcentaje_aprobacion,
            antiguo_importe_por_cancelacion,
            cambios_por_broker_id,
            fecha_de_modificacion
        ) values (
            'UPDATE',
            polizaId,
            aseguradoraId,
            oldNombre,
            nombrePoliza,
            oldDescripcion,
            oldPagoMensual,
            oldEstado,
            oldMontoCobertura,
            oldPorcentaje,
            oldImporte,
            brokerId,
            now()
        );
        
        commit;
    end if;
end;
-- ? Vista para listar los requisitos asociados a cada poliza
-- ? Facilita la gestion de que documentos son necesarios para cada tipo de seguro

DELIMITER $$
create or replace view viewRequesitosPorPolizas as$$
DELIMITER ;
-- ? Vista de solo lectura para analistas de broker que muestra la informacino esencial de
-- ?  las polizas incluyendo metricas para el analisis de datos


DELIMITER $$
create or replace view viewPolizasBrokerAnalista as$$
DELIMITER ;
-- ? Vista para mostrar los datos reducidos para accionar rapido,
-- ? esta es un tipo dashboard mas pequena que permite ver la inormacion de la poliza
-- ? con los totales simples

DELIMITER $$
create or replace view viewInformacionPolizaBasica as$$
DELIMITER ;
-- ? Vista para mostrar polizas agrupadas por aseguradora  lo que nos facilita el analisis
--  y retorno de datos en base de las aseguradoras,permitiendonos filtrar luego en la
-- aplicacion final

DELIMITER $$
create or replace view viewPolizaInfoPorAseguradora as$$
DELIMITER ;
-- ? Vista optimizada para el catalogo publico de polizas, la informacion
-- ? que se obtiene aqui retorna solo la data importante para el usuario

DELIMITER $$
create or replace view  viewPolizaCatalogoCompleto as$$
DELIMITER ;

-- ? Stored Procedure usado para obtener la informacion de usuario basado en un id de usuario

create procedure getUserDataByUserID(
    in UserId int,
    out ResultCode int
)
begin
    -- ? Variables de control
    declare UserExists int default 0;
    declare ExitHandlerCalled boolean default false;
    
    -- ? Handler para capturar errores SQL
    declare exit handler for sqlexception
    begin
        set ExitHandlerCalled = true;
        set ResultCode = 500;
    end;
    
    -- ?  Inicializar codigo de resultado
    set ResultCode = 200;
    
    -- ? Verificar si el usuario existe
    select
        count(*)
    into UserExists
    from Registro_Global_Usuarios registro_usuarios
    join Registro_SignUp_Global registro_global
        on registro_usuarios.id_identidad_registro = registro_global.id_identidad
    where registro_usuarios.id_usuario = UserId
        and registro_global.estado_actividad_registro = 'activo';
    
    -- ? 8. Si usuario no existe, retornar error
    if UserExists = 0 then
        set ResultCode = 404;
        select 'Usuario no encontrado' as mensaje;
    else
        -- ? 9. Retornar datos del usuario
        select 
            registro_usuarios.id_usuario,
            registro_identidad.correo_registro as email,
            registro_usuarios.nombre_prim_usuario,
            registro_usuarios.apellido_prim_usuario,
            registro_usuarios.full_nombre_usuario,
            registro_usuarios.numero_telefono_usuario,
            registro_usuarios.fecha_nacimiento_usuario,
            registro_identidad.estado_actividad_registro as is_active,
            registro_identidad.fecha_registro as created_at,
            roles_usuarios.rol_usuario as role_name
        from Registro_Global_Usuarios registro_usuarios
        join Registro_SignUp_Global registro_identidad
            on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
        join Roles_Users roles_usuarios
            on registro_usuarios.id_usuario = roles_usuarios.id_usuario
        where registro_usuarios.id_usuario = UserId;
    end if;
end;
-- ? Este procedure permite la creacion de un usuario manualmente dentro de la aplicacion.  Este mecanismo esta
-- ? disenado para ser usado por el modulo de admnistracion para crear usuarios dentro de la aplicacion. En cambio,
-- ? cuando se trate de una creacin de usuario por parte del propio modulo de sign up entonces laidea es que el ID del
-- ? admin sea el primer ID del admin con rol global_admin en el sistema.

DELIMITER $$
create procedure crearUsuarioManualDesdeAdminOSignUp$$
DELIMITER ;
    
    -- ?  Inicializar codigo de resultado como exitoso
    set codigoResultado = 200;
    set nuevoUsuarioId = 0;
    
    start transaction;
    
    -- ?  Verificar si el email ya existe en el sistema
    select
        count(*)
    into emailCount
    from   Registro_SignUp_Global 
    where  correo_registro = email;
    
    -- ?  Si email ya existe, retornar error de conflicto
    if emailCount > 0 then
        set codigoResultado = 409; -- En este caso bloqueamos la transaccion si el correo ya existe, esto es porque
        -- queremos garantizar que el correo de los usuarios sea unico al igual que sus usuarios.
        rollback;
    else
        -- ?  Insertar en tabla de registro principal
        insert into Registro_SignUp_Global (
            correo_registro,
            hashed_pwd_registro,
            hashed_pwd_salt_registro,
            estado_actividad_registro,
            fecha_registro
        ) values (
            email,
            passwordHash,
            passwordSalt,
            'activo',
            now()
        );
        
        -- ?  Obtener ID del registro recien creado
        set identityId = last_insert_id();
        
        -- ?  Insertar informacion del usuario
        insert into Registro_Global_Usuarios (
            id_identidad_registro,
            nombre_prim_usuario,
            apellido_prim_usuario,
            full_nombre_usuario,
            numero_telefono_usuario,
            fecha_nacimiento_usuario
        ) values (
            identityId,
            nombrePrim,
            apellidoPrim,
            fullNombre,
            telefono,
            fechaNacimiento
        );
        
        -- ?  Obtener ID del usuario recien creado
        set usuarioId = last_insert_id();
        set nuevoUsuarioId = usuarioId;
        
        -- ?  Asignar rol al usuario
        insert into Roles_Users (
            id_usuario,
            rol_usuario
        ) values (
            usuarioId,
            rolUsuario
        );

        if comingFrom = 'admin' then
            insert into RegistroAudit_AccionesUsuarios (
                id_usuario,
                id_admin_modificacion,
                operacion_realizada,
                nombre_prim_nuevo,
                apellido_prim_nuevo,
                full_nombre_nuevo,
                numero_telefono_nuevo,
                fecha_nacimiento_usuario_nuevo,
                fecha_modificacion_usuario
                )
            values (
                usuarioId,
                adminId,
                'INSERT',
                nombrePrim,
                apellidoPrim,
                fullNombre,
                telefono,
                fechaNacimiento,
                now()
            );
        elseif comingFrom = 'signup' then
            -- ? Obtenemos el id del primer admin con rol global_admin. para esto buscamos en base al rol del usuario
            -- y buscamos filtrando por el tipode global_admin. El primero de estos (asc limit 1) va a ser el que
            -- registremos como workaround
            set adminId = (
                select
                    id_usuario
                from Roles_Users
                where
                    rol_usuario = 'global_admin'
                order by
                    id_usuario
                asc
                limit 1);
            insert into RegistroAudit_AccionesUsuarios (
                id_usuario,
                id_admin_modificacion,
                operacion_realizada,
                nombre_prim_nuevo,
                apellido_prim_nuevo,
                full_nombre_nuevo,
                numero_telefono_nuevo,
                fecha_nacimiento_usuario_nuevo,
                fecha_modificacion_usuario
                )
            values (
                usuarioId,
                adminId,
                'INSERT',
                nombrePrim,
                apellidoPrim,
                fullNombre,
                telefono,
                fechaNacimiento,
                now()
            );
        end if;

        -- ? Guardamos los cambios al final
        commit;
    end if;
end;
-- ?  Stored procedure para eliminar un usuario manualmente
-- ? permitido solo desde el modulo de administracion

DELIMITER $$
create procedure eliminarUnUsuarioAdminOnlyManual$$
DELIMITER ;
    
    -- ?  Inicializar codigo de resultado como exitoso
    set codigoResultado = 200; -- marcamos como el retorno general catch-all como 2xx
    
    start transaction;
    
    -- ?  Verificar si el usuario existe y obtener su rol
    select
        roles_usuarios.rol_usuario,
        1
    into
        rolUsuario,
        usuarioExiste
    from Registro_Global_Usuarios registro_usuarios
    join Roles_Users roles_usuarios
        on registro_usuarios.id_usuario = roles_usuarios.id_usuario
    join Registro_SignUp_Global registro_identidad
        on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
    where  registro_usuarios.id_usuario = usuarioId
      and registro_identidad.estado_actividad_registro = 'activo';
    
    -- ?  Si usuario no existe o ya esta inactivo, retornar error
    if usuarioExiste = 0 then
        set codigoResultado = 404; -- En este caso la query anteiror va a buscar en base al id del usuario que cumpla con
        -- 1. existir y dos teneor un estado activo. En el caso de que no exista entonces no va a registrar nada y el
        -- select va a estar vacio. Si el select esta vacio entonces usuarioExistete se mantiene con su base de 0. En ese
        -- caso entonces no distinguimos sobre el estado, solo retornamos un 404.
        rollback;
    else
        -- ?  Si es Global Admin, verificar que no sea el ultimo
        if rolUsuario in ('global_superadmin', 'global_admin') then
            select
                count(*)
            into globalAdminCount
            from Registro_Global_Usuarios registro_usuarios
            join Roles_Users roles_usuarios
                on registro_usuarios.id_usuario = roles_usuarios.id_usuario
            join Registro_SignUp_Global registro_identidad
                on registro_usuarios.id_identidad_registro = registro_identidad.id_identidad
            where
                roles_usuarios.rol_usuario in ('global_superadmin', 'global_admin')
            and
                registro_identidad.estado_actividad_registro = 'activo'
            and
                registro_usuarios.id_usuario <> usuarioId;
            
            -- ?  Si es el ultimo Global Admin, no permitir eliminacion
            if globalAdminCount = 0 then
                set codigoResultado = 403; -- En este caso la query anterior busca todos los que no tengan un ID
                -- igual al usuario que se esta intentando eliminar. En el caso de que tengan un id igual, entoncesw
                -- al final no lo va a realizar porque seria que no existen mas administradores globales. Esto no es
                -- permitido porque dejaria sin acceso a esas cuentas de administracion.
                rollback;
            end if;
        end if;
        
        -- ?  Si las validaciones pasaron, proceder con soft delete
        if codigoResultado = 200 then
            -- ?  Marcar registro como inactivo (soft delete)
            update Registro_SignUp_Global registro_identidad
            join Registro_Global_Usuarios registro_usuarios
                on registro_identidad.id_identidad = registro_usuarios.id_identidad_registro
            set
                registro_identidad.estado_actividad_registro = 'inactivo'
            where
                registro_usuarios.id_usuario = usuarioId;
            
            -- ?  Registrar eliminacion en auditoria
            insert into RegistroAudit_AccionesUsuarios (
                id_usuario,
                id_admin_modificacion,
                operacion_realizada,
                fecha_modificacion_usuario
            ) values (
                usuarioId,
                adminId,
                'DELETE',
                now()
            );
            
            commit;
        end if;
    end if;
end;
-- ? Stored proicecure que permite actualizar un usuario, sea desde el modulo de administracion
-- ? o desde el modulo de usuarios para que el mismo pueda cambiar sus datos. En este caso, estos se
-- ? diferencian en que van a tener nua marca comingFrom y en base a esta se espera guardar un iD de admin
-- ? diferente.

DELIMITER $$
create procedure actualizarUnUsuarioDesdeAdminOUsuario$$
DELIMITER ;
    
    -- ? Inicializar codigo de resultado como exitoso
    set codigoResultado = 200;
    
    start transaction;
    
    -- ? Verificar si el usuario existe y obtener valores actuales
    select
        nombre_prim_usuario,
        apellido_prim_usuario,
        full_nombre_usuario,
        numero_telefono_usuario,
        fecha_nacimiento_usuario,
        1
    into
        oldNombrePrim,
        oldApellidoPrim,
        oldFullNombre,
        oldTelefono,
        oldFechaNacimiento,
        usuarioExiste
    from Registro_Global_Usuarios
    where
        id_usuario = usuarioId;
    
    -- ? Si usuario no existe, retornar error
    if usuarioExiste = 0 then
        set codigoResultado = 404; -- En el caso de que la query anterior falle (no retorne nada), entonces sabemos
        -- que el problema general es que no hay dad asociada con ese usuario en la tabla de registro de usuarios
        -- si bien ester mecanismo es defensivo, se espera que si se llega a esta zona, no se pueda cometer ese error.
        rollback;
    else
        -- ? Si usuario existe, actualizar campos
        update Registro_Global_Usuarios 
        set
            nombre_prim_usuario = nombrePrim,
            apellido_prim_usuario = apellidoPrim,
            full_nombre_usuario = fullNombre,
            numero_telefono_usuario = telefono,
            fecha_nacimiento_usuario = fechaNacimiento
        where
            id_usuario = usuarioId;
        
        -- ? Actualizar rol del usuario
        update Roles_Users 
        set
            rol_usuario = rolUsuario
        where
            id_usuario = usuarioId;
        
        -- ?Registrar cambios en auditoria
        insert into RegistroAudit_AccionesUsuarios (
            id_usuario,
            id_admin_modificacion,
            operacion_realizada,
            nombre_prim_antiguo,
            apellido_prim_antiguo,
            full_nombre_usuario_antiguo,
            numero_telefono_antiguo,
            fecha_nacimiento_usuario_antiguo,
            nombre_prim_nuevo,
            apellido_prim_nuevo,
            full_nombre_nuevo,
            numero_telefono_nuevo,
            fecha_nacimiento_usuario_nuevo,
            fecha_modificacion_usuario
        ) values (
            usuarioId,
            adminId,
            'UPDATE',
            oldNombrePrim,
            oldApellidoPrim,
            oldFullNombre,
            oldTelefono,
            oldFechaNacimiento,
            nombrePrim,
            apellidoPrim,
            fullNombre,
            telefono,
            fechaNacimiento,
            now()
        );
        commit;
    end if;
end;
-- ? View que permite obtene rla inforamcion basica de los uuarios registrados, en este caso inclusive tenemos data de
-- ? la tabla de los brokers id unidas con un Left Join.

DELIMITER $$
create or replace view viewInformacionuUsuariosBasica as$$
DELIMITER ;
-- ? Vista generada para la rapida visualizacion de la data de los usuarios en el panel de administracion
-- ? en este caso la informaciona agurpa todos los tipos de usaurios, por lo que se agrupa incluyendo los posibles
-- ? roles de los brokers

DELIMITER $$
create or replace view usuarios_por_rol_view as$$
DELIMITER ;


