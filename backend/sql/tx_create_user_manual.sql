-- ?  Transaccion para crear usuario manualmente por Global Admin
-- ?  Incluye validaciones de email unico y manejo de errores
-- ?  Crea registro completo en tablas relacionadas

DELIMITER $$

CREATE PROCEDURE tx_create_user_manual(
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(512),
    IN p_password_salt VARCHAR(512),
    IN p_nombre_prim VARCHAR(255),
    IN p_apellido_prim VARCHAR(255),
    IN p_full_nombre VARCHAR(512),
    IN p_telefono VARCHAR(50),
    IN p_fecha_nacimiento DATE,
    IN p_rol_usuario ENUM('global_superadmin', 'global_admin', 'global_user'),
    IN p_admin_id INT,
    OUT p_result_code INT,
    OUT p_new_user_id INT
)
BEGIN
    -- ? 1. Variables para manejo de errores y control de flujo
    DECLARE v_email_count INT DEFAULT 0;
    DECLARE v_identity_id INT DEFAULT 0;
    DECLARE v_user_id INT DEFAULT 0;
    DECLARE v_exit_handler_called BOOLEAN DEFAULT FALSE;
    
    -- ? 2. Declaramos un Handler para capturar errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET v_exit_handler_called = TRUE;
        SET p_result_code = 500; -- Error interno del servidor
        ROLLBACK;
    END;
    
    -- ? 3. Inicializar codigo de resultado como exitoso y e usuario de salida como cero, 
    -- esto nos sirve para retornar el id del usario al mismo tiempo que retornamos el resultado
    -- para que el front end pueda jalar losd atos nuevos si fuera necesario
    SET p_result_code = 200;
    SET p_new_user_id = 0;
    
    START TRANSACTION;
    
    -- ? 4. Verificamos si el email ya existe en el sistema
    SELECT COUNT(*) INTO v_email_count 
    FROM Registro_SignUp_Global 
    WHERE correo_registro = p_email;
    
    -- ? 5. Si email ya existe, retornar error de conflicto
    IF v_email_count > 0 THEN
        SET p_result_code = 409; -- Conflicto - email ya existe
        ROLLBACK;
    ELSE
        -- ? 5.1. Insertar en tabla de registro principal
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
        
        -- ? 5.2. Obtener ID del registro recien creado
        SET v_identity_id = LAST_INSERT_ID();
        
        -- ? 5.3. Insertar informacion del usuario
        INSERT INTO Registro_Global_Usuarios (
            id_identidad_registro,
            nombre_prim_usuario,
            apellido_prim_usuario,
            full_nombre_usuario,
            numero_telefono_usuario,
            fecha_nacimiento_usuario
        ) VALUES (
            v_identity_id,
            p_nombre_prim,
            p_apellido_prim,
            p_full_nombre,
            p_telefono,
            p_fecha_nacimiento
        );
        
        -- ? 5.4. Obtener ID del usuario recien creado
        SET v_user_id = LAST_INSERT_ID();
        SET p_new_user_id = v_user_id;
        
        -- ? 5.5. Asignamos rol al usuario
        INSERT INTO Roles_Users (
            id_usuario,
            rol_usuario
        ) VALUES (
            v_user_id,
            p_rol_usuario
        );
        
        -- ? 5.6. Registrar accion en auditoria
        INSERT INTO RegistroAudit_AccionesUsuarios (
            id_usuario,
            id_admin_modificacion,
            operacion_realizada,
            nombre_prim_nuevo,
            apellido_prim_nuevo,
            full_nombre_nuevo,
            numero_telefono_nuevo,
            fecha_nacimiento_usuario_nuevo,
            fecha_modificacion_usuario
        ) VALUES (
            v_user_id,
            p_admin_id,
            'INSERT',
            p_nombre_prim,
            p_apellido_prim,
            p_full_nombre,
            p_telefono,
            p_fecha_nacimiento,
            NOW()
        );
        
        -- ? 5.7. Confirmar transaccion si no hubo errores
        IF NOT v_exit_handler_called THEN
            COMMIT;
        END IF;
    END IF;
    
END$$

DELIMITER ;