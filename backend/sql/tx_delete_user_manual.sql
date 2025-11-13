-- ? 1. Transaccion para eliminar usuario manualmente por Global Admin
-- ? 2. Implementa soft delete cambiando estado a inactivo
-- ? 3. Previene eliminacion del ultimo Global Admin del sistema

DELIMITER $$

CREATE PROCEDURE tx_delete_user_manual(
    IN p_user_id INT,
    IN p_admin_id INT,
    OUT p_result_code INT
)
BEGIN
    -- ? 4. Variables para validaciones y control
    DECLARE v_user_exists INT DEFAULT 0;
    DECLARE v_user_role VARCHAR(50);
    DECLARE v_global_admin_count INT DEFAULT 0;
    DECLARE v_exit_handler_called BOOLEAN DEFAULT FALSE;
    
    -- ? 5. Handler para capturar errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET v_exit_handler_called = TRUE;
        SET p_result_code = 500; -- Error interno del servidor
        ROLLBACK;
    END;
    
    -- ? 6. Inicializar codigo de resultado como exitoso
    SET p_result_code = 200;
    
    -- ? 7. Iniciar transaccion
    START TRANSACTION;
    
    -- ? 8. Verificar si el usuario existe y obtener su rol
    SELECT 
        ru.rol_usuario,
        1
    INTO 
        v_user_role,
        v_user_exists
    FROM Registro_Global_Usuarios u
    INNER JOIN Roles_Users ru ON u.id_usuario = ru.id_usuario
    INNER JOIN Registro_SignUp_Global r ON u.id_identidad_registro = r.id_identidad
    WHERE u.id_usuario = p_user_id 
    AND r.estado_actividad_registro = 'activo';
    
    -- ? 9. Si usuario no existe o ya esta inactivo, retornar error
    IF v_user_exists = 0 THEN
        SET p_result_code = 404; -- Usuario no encontrado
        ROLLBACK;
    ELSE
        -- ? 10. Si es Global Admin, verificar que no sea el ultimo
        IF v_user_role IN ('global_superadmin', 'global_admin') THEN
            SELECT COUNT(*) INTO v_global_admin_count
            FROM Registro_Global_Usuarios u
            INNER JOIN Roles_Users ru ON u.id_usuario = ru.id_usuario
            INNER JOIN Registro_SignUp_Global r ON u.id_identidad_registro = r.id_identidad
            WHERE ru.rol_usuario IN ('global_superadmin', 'global_admin')
            AND r.estado_actividad_registro = 'activo'
            AND u.id_usuario != p_user_id;
            
            -- ? 11. Si es el ultimo Global Admin, no permitir eliminacion
            IF v_global_admin_count = 0 THEN
                SET p_result_code = 403; -- Prohibido - ultimo admin
                ROLLBACK;
            END IF;
        END IF;
        
        -- ? 12. Si las validaciones pasaron, proceder con soft delete
        IF p_result_code = 200 THEN
            -- ? 13. Marcar registro como inactivo (soft delete)
            UPDATE Registro_SignUp_Global r
            INNER JOIN Registro_Global_Usuarios u ON r.id_identidad = u.id_identidad_registro
            SET r.estado_actividad_registro = 'inactivo'
            WHERE u.id_usuario = p_user_id;
            
            -- ? 14. Registrar eliminacion en auditoria
            INSERT INTO RegistroAudit_AccionesUsuarios (
                id_usuario,
                id_admin_modificacion,
                operacion_realizada,
                fecha_modificacion_usuario
            ) VALUES (
                p_user_id,
                p_admin_id,
                'DELETE',
                NOW()
            );
            
            -- ? 15. Confirmar transaccion si no hubo errores
            IF NOT v_exit_handler_called THEN
                COMMIT;
            END IF;
        END IF;
    END IF;
    
END$$

DELIMITER ;