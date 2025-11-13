-- ? 1. Transaccion para crear broker manualmente por Global Admin
-- ? 2. Incluye validaciones de email unico y aseguradora valida
-- ? 3. Crea registro completo y asigna rol inicial

DELIMITER $$

CREATE PROCEDURE tx_create_broker_manual(
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(512),
    IN p_password_salt VARCHAR(512),
    IN p_nombre_prim VARCHAR(255),
    IN p_apellido_prim VARCHAR(255),
    IN p_full_nombre VARCHAR(512),
    IN p_telefono VARCHAR(50),
    IN p_fecha_nacimiento DATE,
    IN p_id_aseguradora INT,
    IN p_estado_inicial ENUM('pendiente', 'activo', 'rechazado'),
    IN p_rol_inicial ENUM('broker_superadmin', 'broker_admin', 'broker_analyst'),
    IN p_admin_id INT,
    OUT p_result_code INT,
    OUT p_new_broker_id INT
)
BEGIN
    -- ? 4. Variables para control de flujo
    DECLARE v_email_count INT DEFAULT 0;
    DECLARE v_aseguradora_exists INT DEFAULT 0;
    DECLARE v_identity_id INT DEFAULT 0;
    DECLARE v_broker_id INT DEFAULT 0;
    DECLARE v_exit_handler_called BOOLEAN DEFAULT FALSE;
    
    -- ? 5. Handler para errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET v_exit_handler_called = TRUE;
        SET p_result_code = 500;
        ROLLBACK;
    END;
    
    -- ? 6. Inicializar resultados
    SET p_result_code = 200;
    SET p_new_broker_id = 0;
    
    START TRANSACTION;
    
    -- ? 7. Verificar email unico
    SELECT COUNT(*) INTO v_email_count 
    FROM Registro_SignUp_Global 
    WHERE correo_registro = p_email;
    
    -- ? 8. Verificar que aseguradora existe
    SELECT COUNT(*) INTO v_aseguradora_exists
    FROM Aseguradoras
    WHERE id_aseguradora = p_id_aseguradora;
    
    -- ? 9. Validar email unico
    IF v_email_count > 0 THEN
        SET p_result_code = 409; -- Email ya existe
        ROLLBACK;
    -- ? 10. Validar aseguradora existe
    ELSEIF v_aseguradora_exists = 0 THEN
        SET p_result_code = 404; -- Aseguradora no encontrada
        ROLLBACK;
    ELSE
        -- ? 11. Crear registro principal
        INSERT INTO Registro_SignUp_Global (
            correo_registro,
            hashed_pwd_registro,
            hashed_pwd_salt_registro,
            estado_actividad_registro,
            fecha_registro
        ) VALUES (
            p_email,
            p_password_hash,
            p_password_salt,
            'activo',
            NOW()
        );
        
        SET v_identity_id = LAST_INSERT_ID();
        
        -- ? 12. Crear registro de broker
        INSERT INTO Registro_Global_Brokers (
            id_identidad_registro,
            id_aseguradora,
            nombre_prim_broker,
            apellido_prim_broker,
            full_nombre_broker,
            numero_telefono_broker,
            fecha_nacimiento_broker,
            estado_broker
        ) VALUES (
            v_identity_id,
            p_id_aseguradora,
            p_nombre_prim,
            p_apellido_prim,
            p_full_nombre,
            p_telefono,
            p_fecha_nacimiento,
            p_estado_inicial
        );
        
        SET v_broker_id = LAST_INSERT_ID();
        SET p_new_broker_id = v_broker_id;
        
        -- ? 13. Asignar rol si el estado es activo
        IF p_estado_inicial = 'activo' THEN
            INSERT INTO Roles_Broker (
                id_broker,
                rol_broker
            ) VALUES (
                v_broker_id,
                p_rol_inicial
            );
        END IF;
        
        -- ? 14. Registrar en auditoria
        INSERT INTO RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            nombre_prim_nuevo,
            apellido_prim_nuevo,
            full_nombre_nuevo,
            numero_telefono_nuevo,
            fecha_nacimiento_usuario_nuevo,
            fecha_modificacion_usuario
        ) VALUES (
            v_broker_id,
            p_admin_id,
            'INSERT',
            p_nombre_prim,
            p_apellido_prim,
            p_full_nombre,
            p_telefono,
            p_fecha_nacimiento,
            NOW()
        );
        
        -- ? 15. Confirmar transaccion
        IF NOT v_exit_handler_called THEN
            COMMIT;
        END IF;
    END IF;
    
END$$

DELIMITER ;