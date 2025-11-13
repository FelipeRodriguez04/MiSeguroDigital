-- ? 1. Transaccion para actualizar broker manualmente por Global Admin
-- ? 2. Permite cambio de informacion personal y estado del broker
-- ? 3. Maneja asignacion y cambio de roles segun estado

DELIMITER $$

CREATE PROCEDURE tx_update_broker_manual(
    IN p_broker_id INT,
    IN p_nombre_prim VARCHAR(255),
    IN p_apellido_prim VARCHAR(255),
    IN p_full_nombre VARCHAR(512),
    IN p_telefono VARCHAR(50),
    IN p_fecha_nacimiento DATE,
    IN p_estado_broker ENUM('pendiente', 'activo', 'rechazado'),
    IN p_rol_broker ENUM('broker_superadmin', 'broker_admin', 'broker_analyst'),
    IN p_admin_id INT,
    OUT p_result_code INT
)
BEGIN
    -- ? 4. Variables para valores anteriores
    DECLARE v_old_nombre VARCHAR(255);
    DECLARE v_old_apellido VARCHAR(255);
    DECLARE v_old_full_nombre VARCHAR(512);
    DECLARE v_old_telefono VARCHAR(50);
    DECLARE v_old_fecha_nacimiento DATE;
    DECLARE v_old_estado VARCHAR(50);
    DECLARE v_broker_exists INT DEFAULT 0;
    DECLARE v_has_role INT DEFAULT 0;
    DECLARE v_exit_handler_called BOOLEAN DEFAULT FALSE;
    
    -- ? 5. Handler para errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET v_exit_handler_called = TRUE;
        SET p_result_code = 500;
        ROLLBACK;
    END;
    
    -- ? 6. Inicializar resultado
    SET p_result_code = 200;
    
    START TRANSACTION;
    
    -- ? 7. Verificar existencia y obtener valores actuales
    SELECT 
        nombre_prim_broker,
        apellido_prim_broker,
        full_nombre_broker,
        numero_telefono_broker,
        fecha_nacimiento_broker,
        estado_broker,
        1
    INTO 
        v_old_nombre,
        v_old_apellido,
        v_old_full_nombre,
        v_old_telefono,
        v_old_fecha_nacimiento,
        v_old_estado,
        v_broker_exists
    FROM Registro_Global_Brokers 
    WHERE id_broker = p_broker_id;
    
    -- ? 8. Verificar si broker no existe
    IF v_broker_exists = 0 THEN
        SET p_result_code = 404; -- Broker no encontrado
        ROLLBACK;
    ELSE
        -- ? 9. Actualizar informacion del broker
        UPDATE Registro_Global_Brokers 
        SET 
            nombre_prim_broker = p_nombre_prim,
            apellido_prim_broker = p_apellido_prim,
            full_nombre_broker = p_full_nombre,
            numero_telefono_broker = p_telefono,
            fecha_nacimiento_broker = p_fecha_nacimiento,
            estado_broker = p_estado_broker
        WHERE id_broker = p_broker_id;
        
        -- ? 10. Verificar si ya tiene rol asignado
        SELECT COUNT(*) INTO v_has_role
        FROM Roles_Broker
        WHERE id_broker = p_broker_id;
        
        -- ? 11. Manejar roles segun estado
        IF p_estado_broker = 'activo' THEN
            -- ? 12. Si esta activo, asegurar que tenga rol
            IF v_has_role = 0 THEN
                INSERT INTO Roles_Broker (id_broker, rol_broker)
                VALUES (p_broker_id, p_rol_broker);
            ELSE
                UPDATE Roles_Broker 
                SET rol_broker = p_rol_broker
                WHERE id_broker = p_broker_id;
            END IF;
        ELSEIF p_estado_broker IN ('pendiente', 'rechazado') AND v_has_role > 0 THEN
            -- ? 13. Si no esta activo, remover rol si existe
            DELETE FROM Roles_Broker WHERE id_broker = p_broker_id;
        END IF;
        
        -- ? 14. Registrar cambios en auditoria
        INSERT INTO RegistroAudit_AccionesBrokers (
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
        ) VALUES (
            p_broker_id,
            p_admin_id,
            'UPDATE',
            v_old_nombre,
            v_old_apellido,
            v_old_full_nombre,
            v_old_telefono,
            v_old_fecha_nacimiento,
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