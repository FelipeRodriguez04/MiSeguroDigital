-- ? 1. Transaccion para eliminar broker manualmente por Global Admin
-- ? 2. Implementa soft delete cambiando estado de registro
-- ? 3. Limpia roles asociados y registra en auditoria

DELIMITER $$

CREATE PROCEDURE tx_delete_broker_manual(
    IN p_broker_id INT,
    IN p_admin_id INT,
    OUT p_result_code INT
)
BEGIN
    -- ? 4. Variables de control
    DECLARE v_broker_exists INT DEFAULT 0;
    DECLARE v_identity_id INT DEFAULT 0;
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
    
    -- ? 7. Verificar existencia del broker y obtener identity_id
    SELECT 
        id_identidad_registro,
        1
    INTO 
        v_identity_id,
        v_broker_exists
    FROM Registro_Global_Brokers b
    INNER JOIN Registro_SignUp_Global r ON b.id_identidad_registro = r.id_identidad
    WHERE b.id_broker = p_broker_id 
    AND r.estado_actividad_registro = 'activo';
    
    -- ? 8. Si broker no existe o ya esta inactivo
    IF v_broker_exists = 0 THEN
        SET p_result_code = 404; -- Broker no encontrado
        ROLLBACK;
    ELSE
        -- ? 9. Eliminar roles del broker si existen
        DELETE FROM Roles_Broker 
        WHERE id_broker = p_broker_id;
        
        -- ? 10. Soft delete del registro principal
        UPDATE Registro_SignUp_Global 
        SET estado_actividad_registro = 'inactivo'
        WHERE id_identidad = v_identity_id;
        
        -- ? 11. Registrar eliminacion en auditoria
        INSERT INTO RegistroAudit_AccionesBrokers (
            id_broker,
            id_admin_modificacion,
            operacion_realizada,
            fecha_modificacion_usuario
        ) VALUES (
            p_broker_id,
            p_admin_id,
            'DELETE',
            NOW()
        );
        
        -- ? 12. Confirmar transaccion
        IF NOT v_exit_handler_called THEN
            COMMIT;
        END IF;
    END IF;
    
END$$

DELIMITER ;