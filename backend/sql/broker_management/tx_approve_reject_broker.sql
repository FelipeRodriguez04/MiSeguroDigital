-- ? 1. Transaccion para aprobar o rechazar solicitudes de broker
-- ? 2. Cambia estado y asigna rol inicial si es aprobado
-- ? 3. Registra quien tomo la decision en auditoria

DELIMITER $$

CREATE PROCEDURE tx_approve_reject_broker(
    IN p_broker_id INT,
    IN p_action ENUM('aprobar', 'rechazar'),
    IN p_rol_inicial ENUM('broker_superadmin', 'broker_admin', 'broker_analyst'),
    IN p_admin_id INT,
    OUT p_result_code INT
)
BEGIN
    -- ? 4. Variables de control
    DECLARE v_broker_exists INT DEFAULT 0;
    DECLARE v_current_status VARCHAR(50);
    DECLARE v_new_status VARCHAR(50);
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
    
    -- ? 7. Verificar existencia y estado actual del broker
    SELECT 
        estado_broker,
        1
    INTO 
        v_current_status,
        v_broker_exists
    FROM Registro_Global_Brokers b
    INNER JOIN Registro_SignUp_Global r ON b.id_identidad_registro = r.id_identidad
    WHERE b.id_broker = p_broker_id 
    AND r.estado_actividad_registro = 'activo';
    
    -- ? 8. Validar existencia del broker
    IF v_broker_exists = 0 THEN
        SET p_result_code = 404; -- Broker no encontrado
        ROLLBACK;
    -- ? 9. Validar que este en estado pendiente
    ELSEIF v_current_status != 'pendiente' THEN
        SET p_result_code = 409; -- Conflicto - no esta pendiente
        ROLLBACK;
    ELSE
        -- ? 10. Determinar nuevo estado segun accion
        IF p_action = 'aprobar' THEN
            SET v_new_status = 'activo';
        ELSE
            SET v_new_status = 'rechazado';
        END IF;
        
        -- ? 11. Actualizar estado del broker
        UPDATE Registro_Global_Brokers 
        SET estado_broker = v_new_status
        WHERE id_broker = p_broker_id;
        
        -- ? 12. Si fue aprobado, asignar rol inicial
        IF p_action = 'aprobar' THEN
            INSERT INTO Roles_Broker (
                id_broker,
                rol_broker
            ) VALUES (
                p_broker_id,
                p_rol_inicial
            );
        END IF;
        
        -- ? 13. Registrar decision en auditoria
        INSERT INTO RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            fecha_modificacion_usuario
        ) VALUES (
            p_broker_id,
            p_admin_id,
            'UPDATE',
            NOW()
        );
        
        -- ? 14. Confirmar transaccion
        IF NOT v_exit_handler_called THEN
            COMMIT;
        END IF;
    END IF;
    
END$$

DELIMITER ;