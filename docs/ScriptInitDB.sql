-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema MiSeguroDigital
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema MiSeguroDigital
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `MiSeguroDigital` DEFAULT CHARACTER SET utf8 ;
USE `MiSeguroDigital` ;

-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Registro_SignUp_Global`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`Registro_SignUp_Global` (
  `id_identidad` INT NOT NULL AUTO_INCREMENT,
  `correo_registro` VARCHAR(255) NOT NULL,
  `hashed_pwd_registro` VARCHAR(512) NOT NULL,
  `hashed_pwd_salt_registro` VARCHAR(512) NOT NULL,
  `estado_actividad_registro` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_identidad`),
  UNIQUE INDEX `correo_registro_UNIQUE` (`correo_registro` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Registro_Global_Usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`Registro_Global_Usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `id_identidad_registro` INT NOT NULL,
  `nombre_prim_usuario` VARCHAR(255) NOT NULL,
  `apellido_prim_usuario` VARCHAR(255) NOT NULL,
  `full_nombre_usuario` VARCHAR(512) NOT NULL,
  `numero_telefono_usuario` VARCHAR(50) NOT NULL,
  `fecha_nacimiento_usuario` DATE NOT NULL,
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`Aseguradoras` (
  `id_aseguradora` INT NOT NULL AUTO_INCREMENT,
  `nombre_aseguradora` VARCHAR(255) NOT NULL,
  `dominio_correo_aseguradora` VARCHAR(255) NOT NULL,
  `calle_principal_aseguradora` VARCHAR(255) NOT NULL,
  `calle_secundaria_aseguradora` VARCHAR(255) NOT NULL,
  `edifico_aseguradora` VARCHAR(255) NULL,
  `numero_oficina_aseguradora` VARCHAR(255) NOT NULL,
  `telefono_aseguradora` VARCHAR(50) NOT NULL,
  `sitio_web_aseguradora` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_aseguradora`),
  UNIQUE INDEX `dominio_correo_aseguradora_UNIQUE` (`dominio_correo_aseguradora` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Registro_Global_Brokers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`Registro_Global_Brokers` (
  `id_broker` INT NOT NULL AUTO_INCREMENT,
  `id_identidad_registro` INT NOT NULL,
  `id_aseguradora` INT NOT NULL,
  `nombre_prim_broker` VARCHAR(255) NOT NULL,
  `apellido_prim_broker` VARCHAR(255) NOT NULL,
  `full_nombre_broker` VARCHAR(512) NOT NULL,
  `numero_telefono_broker` VARCHAR(50) NOT NULL,
  `fecha_nacimiento_broker` DATE NOT NULL,
  `estado_broker` ENUM('pendiente', 'rechazado', 'activo') NOT NULL DEFAULT 'pendiente',
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`Roles_Broker` (
  `id_rol_broker` INT NOT NULL AUTO_INCREMENT,
  `id_broker` INT NOT NULL,
  `rol_broker` ENUM('broker_superadmin', 'broker_admin', 'broker_analyst') NOT NULL DEFAULT 'broker_analyst',
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`PolizasDeSeguro` (
  `id_poliza` INT NOT NULL AUTO_INCREMENT,
  `id_aseguradora` INT NOT NULL,
  `nombre_de_la_poliza` VARCHAR(255) NOT NULL,
  `descripcion_de_la_poliza` TEXT NOT NULL,
  `tipo_de_poliza` ENUM('seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud') NOT NULL,
  `pago_mensual` DECIMAL(10,2) NOT NULL,
  `monto_cobertura_total` DECIMAL(15,2) NULL,
  `duracion_de_contrato` INT NOT NULL,
  `porcentaje_de_aprobacion` DECIMAL(5,2) NOT NULL,
  `importe_por_cancelacion` DECIMAL(10,2) NOT NULL,
  `estado_de_poliza` ENUM('activa', 'pausada', 'despublicada') NOT NULL DEFAULT 'activa',
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`AplicacionAPoliza` (
  `id_aplicacion_poliza` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_poliza` INT NOT NULL,
  `id_broker_que_reviso` INT NULL,
  `fecha_de_aplicacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado_actual_aplicacion` ENUM('pendiente_procesar', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente_procesar',
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`RegistroDeUsuarioEnPoliza` (
  `id_registro_en_poliza` INT NOT NULL AUTO_INCREMENT,
  `id_poliza` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `id_aplicacion_a_poliza` INT NOT NULL,
  `fecha_inicio_registro` DATE NOT NULL,
  `fecha_finalizacion_registro` DATE NOT NULL,
  `poliza_con_autorenew` TINYINT NOT NULL DEFAULT 0,
  `estado_de_registro` ENUM('registro_activo', 'registro_cancelado', 'registro_expirado') NOT NULL DEFAULT 'registro_activo',
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`PagosPorPoliza` (
  `id_pago` INT NOT NULL AUTO_INCREMENT,
  `id_registro_poliza` INT NOT NULL,
  `cantidad_pago` DECIMAL(10,2) NOT NULL,
  `metodo_de_pago` ENUM('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'cheque', 'otro') NOT NULL,
  `estado_del_pago` ENUM('pendiente', 'completado', 'fallido', 'reembolsado') NOT NULL DEFAULT 'pediente',
  `motivo_del_pago` ENUM('pago_mensualidad', 'pago_importe_cancelacion') NOT NULL,
  `fecha_de_pago` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`RegistroAudit_RegistrosPolizas` (
  `id_audit_registro` INT NOT NULL AUTO_INCREMENT,
  `operacion_realizada` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  `id_registro_poliza` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `id_poliza` INT NOT NULL,
  `antiguo_autorenovacion` TINYINT NULL,
  `fech_registro_antiguo` DATE NULL,
  `fecha_finalizacion_registro_antiguo` DATE NULL,
  `estatus_antiguo` ENUM('activo', 'cancelado', 'expirado') NULL,
  `fecha_cancelacion_antiguo` DATE NULL,
  `cambios_por_usuario_id` INT NULL,
  `cambios_por_broker_id` INT NULL,
  `fecha_de_modificacion` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_audit_registro`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`RegistroAudit_Polizas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`RegistroAudit_Polizas` (
  `id_audit_poliza` INT NOT NULL AUTO_INCREMENT,
  `operacion_realizada` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  `id_poliza` INT NOT NULL,
  `id_aseguradora` INT NOT NULL,
  `antiguo_nombre_poliza` VARCHAR(255) NULL,
  `nuevo_nombre_poliza` VARCHAR(255) NULL,
  `antiguo_descripcion_poliza` TEXT NULL,
  `antiguo_pago_mensual` DECIMAL(10,2) NULL,
  `antiguo_estatus_poliza` ENUM('activa', 'pausada', 'unpublished') NULL,
  `cambios_por_broker_id` INT NOT NULL,
  `fecha_de_modificacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `antiguo_monto_cobertura_total` DECIMAL(15,2) NULL,
  `antiguo_duracion_de_contrato` ENUM('activa', 'pausada', 'despublicada') NULL,
  `antiguo_porcentaje_aprobacion` DECIMAL(5,2) NULL,
  `antiguo_importe_por_cancelacion` DECIMAL(10,2) NULL,
  `antiguo_estado_de_poliza` VARCHAR(45) NULL DEFAULT 'activa',
  PRIMARY KEY (`id_audit_poliza`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`ReviewsDePolizas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`ReviewsDePolizas` (
  `id_review` INT NOT NULL AUTO_INCREMENT,
  `rating_del_usuario` INT NOT NULL,
  `contexto_review` TEXT NULL,
  `tiene_hidden_fees` TINYINT NOT NULL DEFAULT 0,
  `detalle_hidden_fees` TEXT NULL,
  PRIMARY KEY (`id_review`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`RegistroAudit_EstadoAplicacionPoliza`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`RegistroAudit_EstadoAplicacionPoliza` (
  `id_historial_aplicacion` INT NOT NULL AUTO_INCREMENT,
  `id_aplicacion_poliza` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `id_poliza` INT NOT NULL,
  `id_broker_modificador` INT NOT NULL,
  `estado_aplicacion_antiguo` ENUM('pendiente_procesar', 'aprobada', 'rechazada') NULL,
  `razon_rechazo_broker_antigua` TEXT NULL,
  `fecha_de_modificacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial_aplicacion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`Requerimientos_por_Poliza`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`Requerimientos_por_Poliza` (
  `id_requerimiento` INT NOT NULL AUTO_INCREMENT,
  `id_poliza` INT NOT NULL,
  `tipo_requerimiento` ENUM('registros_medicos', 'estados_de_cuenta', 'historial_crediticio', 'prueba_de_residencia', 'otro') NOT NULL,
  `descripcion_requerimiento` TEXT NULL,
  `requerimiento_obligatorio` TINYINT NOT NULL DEFAULT 1,
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`Documentos_por_AplicacionPoliza` (
  `id_documento_aplicacion` INT NOT NULL AUTO_INCREMENT,
  `id_de_usuario_carga` INT NOT NULL,
  `id_aplicacion_poliza` INT NOT NULL,
  `id_requerimiento_poliza` INT NOT NULL,
  `nombre_del_documento` VARCHAR(255) NOT NULL,
  `fecha_de_carga` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`Roles_Users` (
  `id_rol_user` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `rol_usuario` ENUM('global_superadmin', 'global_admin', 'global_user') NOT NULL DEFAULT 'global_user',
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`RegistroAudit_AccionesUsuarios` (
  `id_audit_usuarios` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_admin_modificacion` INT NULL,
  `operacion_realizada` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
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
  `fecha_modificacion_usuario` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_audit_usuarios`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`RegistroAudit_AccionesBrokers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`RegistroAudit_AccionesBrokers` (
  `id_audit_brokers` INT NOT NULL AUTO_INCREMENT,
  `id_broker` INT NOT NULL,
  `id_admin_modificacion` INT NULL,
  `operacion_realizada` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
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
  `fecha_modificacion_usuario` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_audit_brokers`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiSeguroDigital`.`ReviewsDeUsuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`ReviewsDeUsuarios` (
  `id_review_poliza` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `id_poliza` INT NOT NULL,
  `fecha_creacion_review` DATE NOT NULL,
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`BienesPorUsuario` (
  `id_bien` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `valoracion_bien` DECIMAL(10,2) NOT NULL,
  `tipo_de_bien` ENUM('bien_inmueble', 'bien_automotriz', 'otro') NOT NULL,
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
CREATE TABLE IF NOT EXISTS `MiSeguroDigital`.`BienesAseguradosPorUsuario` (
  `id_registro_en_poliza` INT NOT NULL,
  `id_bien_del_usuario` INT NOT NULL,
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


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
