-- ? 1. Transaccion para actualizar usuario manualmente por Global Admin
-- ? 2. Permite modificacion de campos de perfil y rol del usuario
-- ? 3. Registra cambios en auditoria con valores anteriores y nuevos

DELIMITER $$

CREATE PROCEDURE tx_update_user_manual(
    IN p_user_id INT,
    IN p_nombre_prim VARCHAR(255),
    IN p_apellido_prim VARCHAR(255),
    IN p_full_nombre VARCHAR(512),
    IN p_telefono VARCHAR(50),
    IN p_fecha_nacimiento DATE,
    IN p_rol_usuario ENUM('global_superadmin', 'global_admin', 'global_user'),
    IN p_admin_id INT,
    OUT p_result_code INT
)
BEGIN
    -- ? 4. Variables para almacenar valores anteriores
    DECLARE v_old_nombre_prim VARCHAR(255);
    DECLARE v_old_apellido_prim VARCHAR(255);
    DECLARE v_old_full_nombre VARCHAR(512);
    DECLARE v_old_telefono VARCHAR(50);
    DECLARE v_old_fecha_nacimiento DATE;
    DECLARE v_user_exists INT DEFAULT 0;
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
    
    -- ? 8. Verificar si el usuario existe y obtener valores actuales
    SELECT 
        nombre_prim_usuario,
        apellido_prim_usuario,
        full_nombre_usuario,
        numero_telefono_usuario,
        fecha_nacimiento_usuario,
        1
    INTO 
        v_old_nombre_prim,
        v_old_apellido_prim,
        v_old_full_nombre,
        v_old_telefono,
        v_old_fecha_nacimiento,
        v_user_exists
    FROM Registro_Global_Usuarios 
    WHERE id_usuario = p_user_id;
    
    -- ? 9. Si usuario no existe, retornar error
    IF v_user_exists = 0 THEN
        SET p_result_code = 404; -- Usuario no encontrado
        ROLLBACK;
    ELSE
        -- ? 10. Actualizar informacion del usuario
        UPDATE Registro_Global_Usuarios 
        SET 
            nombre_prim_usuario = p_nombre_prim,
            apellido_prim_usuario = p_apellido_prim,
            full_nombre_usuario = p_full_nombre,
            numero_telefono_usuario = p_telefono,
            fecha_nacimiento_usuario = p_fecha_nacimiento
        WHERE id_usuario = p_user_id;
        
        -- ? 11. Actualizar rol del usuario
        UPDATE Roles_Users 
        SET rol_usuario = p_rol_usuario
        WHERE id_usuario = p_user_id;
        
        -- ? 12. Registrar cambios en auditoria
        INSERT INTO RegistroAudit_AccionesUsuarios (
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
        ) VALUES (
            p_user_id,
            p_admin_id,
            'UPDATE',
            v_old_nombre_prim,
            v_old_apellido_prim,
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
        
        -- ? 13. Confirmar transaccion si no hubo errores
        IF NOT v_exit_handler_called THEN
            COMMIT;
        END IF;
    END IF;
    
END$$

DELIMITER ;