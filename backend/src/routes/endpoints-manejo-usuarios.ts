import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Obtener perfil de usuario por ID.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario a obtener (numero).
 * @returns Retorna: datos completos del perfil del usuario.
 */
router.get('/perfil/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  try {
    const connection = await getConnection();
    const [rows, metadata] =
        await connection.execute(
            'select * from MiSeguroDigital.viewInformacionuUsuariosBasica ' +
            'where id_usuario = ?', [userId]);
    await connection.end();
    
    if (Array.isArray(rows) && rows.length > 0) {
      const brokerData = rows[0] as any;
      res.json({
          id_usuario: brokerData?.id_usuario,
          correo_registro: brokerData?.email,
          nombre_primario: brokerData?.nombre_prim_usuario,
          apellido_primario: brokerData?.apellido_prim_usuario,
          nombre_completo: brokerData?.full_nombre_usuario,
          telefono: brokerData?.numero_telefono_usuario,
          fecha_nacimiento: brokerData?.fecha_nacimiento_usuario,
          estado_regisro: brokerData?.is_active,
          fecha_registro: brokerData?.created_at,
          rol_usuario: brokerData?.role_name,
          id_broker: brokerData?.id_broker,
          estado_broker: brokerData?.broker_status
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @description Actualizar informacion de usuario desde administrador.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario a actualizar (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.comingFrom - Parametro que determine si la solicitud viene desde el modulo de usuarios (valor de
 * 'user'), o desde el modulo de administradores (valor de 'admin'). El mecanismo interno requiere este
 * conocimiento para funcionar
 * @param {string} body.nombrePrim - Nuevo primer nombre del usuario (string).
 * @param {string} body.apellidoPrim - Nuevo primer apellido del usuario (string).
 * @param {string} body.fullNombre - Nuevo nombre completo del usuario (string).
 * @param {string} body.telefono - Nuevo telefono del usuario (string).
 * @param {string} body.fechaNacimiento - Nueva fecha de nacimiento del usuario (string).
 * @param {string} body.rolUsuario - Nuevo rol del usuario (string).
 * @param {number} body.adminId - ID del administrador que realiza la actualizacion (numero).
 * @returns Retorna: confirmacion de actualizacion o error.
 */
router.put('/admin/actualizar/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {   comingFrom, nombrePrim, apellidoPrim,
            fullNombre, telefono, fechaNacimiento,
            rolUsuario, adminId } = req.body;
  
  try {
    const connection = await getConnection();
    const [rows, metadata] =
          await connection.execute(
              'call MiSeguroDigital.actualizarUnUsuarioDesdeAdminOUsuario(?,?,?,?,?,?,?,?,?,@codigoResultado)',
              [userId, comingFrom === 'admin'? comingFrom : 'admin', nombrePrim, apellidoPrim,
                  fullNombre, telefono, fechaNacimiento, rolUsuario, adminId]);
    const [resultCode, metadata2] = await connection.execute('SELECT @ResultCode as codigo');
    await connection.end();
    
    //? 2. Con la respuesta de la llamada vamos a revisar el estado interno
    const codigo = Array.isArray(resultCode) && resultCode[0] ? (resultCode[0] as any).codigo : 500;

    if (codigo === 200) {
      res.json({ success: true, message: 'Usuario actualizado correctamente' });
    } else if (codigo === 404){
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    } else {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Eliminar usuario (solo administradores).
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario a eliminar (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.adminId - ID del administrador que elimina el usuario (numero).
 * @returns Retorna: confirmacion de eliminacion o error.
 */
router.delete('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { adminId } = req.body;
  
  try {
    const connection = await getConnection();
    const [rows, metadataOne] =
        await connection.execute(
            'CALL MiSeguroDigital.eliminarUnUsuarioAdminOnlyManual(?,?, @codigoResultado)',
            [userId, adminId]);
    const [resultCode, metadataTwo] = await connection.execute('SELECT @ResultCode as codigo');
    await connection.end();

    const codigoSalida = Array.isArray(resultCode) && resultCode[0] ? (resultCode[0] as any).codigo : 500;

    if (codigoSalida === 200) {
      res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } else if (codigoSalida === 404) {
      res.status(codigoSalida).json({ success: false, message: 'Usuario no encontrado' });
    } else if (codigoSalida === 403) {
      res.status(codigoSalida).json({ success: false, message: 'No tienes permisos para eliminar este usuario puede ' +
              'ser que el usuario sea un admin y se bloquee' });
    } else {
      res.status(codigoSalida).json({ success: false, message: 'Error interno del servidor' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Actualizar perfil propio del usuario autenticado.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.nombrePrim - Nuevo primer nombre del usuario (string).
 * @param {string} body.apellidoPrim - Nuevo primer apellido del usuario (string).
 * @param {string} body.fullNombre - Nuevo nombre completo del usuario (string).
 * @param {string} body.telefono - Nuevo telefono del usuario (string).
 * @param {string} body.fechaNacimiento - Nueva fecha de nacimiento del usuario (string).
 * @param {number} body.userId - ID del usuario que actualiza su propio perfil (numero).
 * @returns Retorna: confirmacion de actualizacion o error.
 */
router.put('/actualizar/mi-perfil', async (req: Request, res: Response) => {
  const { nombrePrim, apellidoPrim, fullNombre, telefono, fechaNacimiento, userId } = req.body;
  
  try {
    const connection = await getConnection();
      const [rows, metadata] =
          await connection.execute(
              'call MiSeguroDigital.actualizarUnUsuarioDesdeAdminOUsuario(?,?,?,?,?,?,?,?,?,@codigoResultado)',
              [userId, 'user', nombrePrim, apellidoPrim,
                  fullNombre, telefono, fechaNacimiento,'global_user', userId]);
      const [resultCode, metadata2] = await connection.execute('SELECT @ResultCode as codigo');
    await connection.end();
    
    //? 2. Con la respuesta de la llamada vamos a revisar el estado interno
    const codigo = Array.isArray(resultCode) && resultCode[0] ? (resultCode[0] as any).codigo : 500;
    if (codigo === 200) {
      res.json({ success: true, message: 'Perfil actualizado correctamente' });
    } else if (codigo === 404) {
      res.status(codigo).json({ success: false, message: 'Usuario no encontrado' });
    }else {
      res.status(codigo).json({ success: false, message: 'Error interno del servidor' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Obtener usuarios filtrados por rol.
 * @param {object} query - Parametros de consulta.
 * @param {string} query.rol - Rol a filtrar (string).
 * @returns Retorna: lista de usuarios con el rol especificado.
 */
router.get('/admin/usuarios-por-rol', async (req: Request, res: Response) => {
  const { rol } = req.query;
  
  try {
    const connection = await getConnection();
    const [rows, metadata] =
        await connection.execute(
            'select * from MiSeguroDigital.usuarios_por_rol_view where role_name = ?', [rol]);
    await connection.end();

    //? 2. Con la salida armamos un json de respuesta por cada fila
    let arrayOfUserJsons = Array.isArray(rows) ? rows.map((row: any) => ({
        id_usuario: row.id_usuario,
        correo_registro: row.email,
        nombre_primario: row.nombre_prim_usuario,
        apellido_primario: row.apellido_prim_usuario,
        nombre_completo: row.full_nombre_usuario,
        telefono: row.numero_telefono_usuario,
        estado_regisro: row.is_active,
        fecha_registro: row.created_at,
        rol_usuario: row.role_name,
        })): [];
    if ( arrayOfUserJsons.length > 0) {
        res.status(200).json(arrayOfUserJsons);
    } else {
        res.status(404).json({ message: 'No se encontraron usuarios con el rol especificado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;