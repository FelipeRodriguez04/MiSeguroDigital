import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Obtener perfil de usuario por ID.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario a obtener (numero).
 * @returns Retorna: datos completos del perfil del usuario.
 */

//LISTO!!

router.get('/obtener-perfil/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  //? 1. Revisamos que el parametro no sea nulo y sea mayor que cero
  if (!userId || Number(userId) <= 0) {
    return res.status(400)
			.json({
				success: false,
				message: 'Error Code 0x001 - [Raised] ID de usuario no valido',
				offender: 'userId'
			});
  }

	//? 2. Realizamos el procedimiento interno
  try {
    const connection = await getConnection();
    const [rows] =
        await connection.execute(
            'select * from MiSeguroDigital.viewInformacionUsuariosBasica where id_usuario = ?',
						[userId]);

    await connection.end();
    
    //? 2.1 Sacamos la data del retorno convirtiendola en un posible arreglo de datos, o vacio
		let arrayOfUserData = Array.isArray(rows) ? rows.map((row: any) => ({
			id_usuario: row.id_usuario,
			email: row.email,
			nombre_prim_usuario: row.nombre_prim_usuario,
			apellido_prim_usuario: row.apellido_prim_usuario,
			full_nombre_usuario: row.full_nombre_usuario,
			numero_telefono_usuario: row.numero_telefono_usuario,
			fecha_nacimiento_usuario: row.fecha_nacimiento_usuario,
			is_active: row.is_active,
			fecha_creacion_usuario: row.created_at,
			rol: row.role_name,
			broker_rol: row.broker_id,
			broker_status: row.broker_status
		})) : [];

		if (arrayOfUserData.length > 0) {
			res.status(200).json({
				success: true,
				message: 'Datos del usuario obtenidos correctamente',
				data: arrayOfUserData,
				offender: ''
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Usuario no encontrado',
				data: [],
				offender: 'userId'
			});
		}
  } catch (error) {
    res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		});
  }
});

/**
 * @description Actualizar informacion de usuario desde administrador. Esta ruta permite enviar a modificar la data de un usuario
 * basado en el id de la persona, userId, y los datos nuevos que se quiere actualizar, incluido el rol de Usuario. Por esto,
 * se considera que este endpoint, al igual que el endpoint de registrar un usuario deben usarse con verificacion de administracion
 * para evitar que usuarios no autorizados puedan modificar datos de otros usuarios y escalar sus privilegios.
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
router.put('/admin/actualizar-perfil-usuario/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {   comingFrom, nombrePrim, apellidoPrim,
            fullNombre, telefono, fechaNacimiento,
            rolUsuario, adminId } = req.body;

	//? 1.1 Validamos que toda la data ingresada no sea nula
	if (!userId || !comingFrom || !nombrePrim || !apellidoPrim || !fullNombre 
		|| !telefono || !fechaNacimiento || !rolUsuario || !adminId) {
		res.status(400).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Datos de entrada no validos',
				offender: (!userId) ? 'userId' : (!comingFrom) ? 'comingFrom' : (!nombrePrim) ? 'nombrePrim' : (!apellidoPrim) ? 'apellidoPrim' : (!fullNombre) ? 
					'fullNombre' : (!telefono) ? 'telefono' : 
						(!fechaNacimiento) ? 'fechaNacimiento' : 
							(!rolUsuario) ? 'rolUsuario' : 'adminId'			
		});
	}
	
	//? 1.2 Validamos que el id del adminsitrador y isuarios sean mayores que cero
	if (Number(adminId) <= 0 || Number(userId) <= 0) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] ID de usuario o administrador no valido',
			offender: (Number(adminId) <= 0) ? 'adminId' : 'userId'
		});
	}

	//? 1.3 Validamos que el valor del came from este dentro de los valores del enum, si no lo es entonces la ruta
	//? se llamo externamente y bloqueamos
	if (!['user', 'admin'].includes(comingFrom)) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Valor de comingFrom no valido',
			offender: 'comingFrom'
		});
	}

	//? 1.4 Validamos que el rol del usuario sea valido
	if (!['global_user', 'global_superadmin', 'global_admin'].includes(rolUsuario)) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Rol de usuario no valido',
			offender: 'rolUsuario'
		});
	}

	//? 2. Ejecutamos el procedimiento interno

  try {
    const connection = await getConnection();
    await connection.execute(
    	'call MiSeguroDigital.actualizarUnUsuarioDesdeAdminOUsuario(?,?,?,?,?,?,?,?,?,@codigoResultado)',
      	[userId, nombrePrim, apellidoPrim,
        	fullNombre, telefono, fechaNacimiento, rolUsuario,
					comingFrom === 'admin'? comingFrom : 'admin', adminId]);
    const [resultCode] = await connection.execute('SELECT @ResultCode as codigo');
    await connection.end();
    
    //? 2.1 Con la respuesta de la llamada vamos a revisar el estado interno
    const codigo =
			Array.isArray(resultCode) && resultCode[0] ? (resultCode[0] as any).codigo : 500;

		//? 2.2 Retornamos informacion en base al id
    if (codigo === 200){
			res.status(200).json({
				success: true,
				message: 'Perfil actualizado correctamente',
				offender: ''
			})
		} else if (codigo === 404){
			res.status(404).json(
				{
					success: false,
					message: 'Error Code 0x001 - [Raised] Usuario no encontrado',
					offender: 'userId'
				}
			)
		} else {
			res.status(400).json(
				{
					success: false,
					message: 'Error Code 0x001 - [Raised] API Error al realizar la actualizacion de datos',
					offender: 'API Error'
				}
			)
		}
  } catch (error) {
    res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		});
  }
});

/**
 * @description Eliminar usuario (solo administradores). Esta ruta permite eliminar un usuario de la base de datos
 * lo qe en este caso se guarda como un SoftDelete con la flag de inactivo en lugar de eliminar la data ocmpletamente. Esta
 * ruta debe ser validad en el frontend para ser usada por un administrador.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario a eliminar (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.adminId - ID del administrador que elimina el usuario (numero).
 * @returns Retorna: confirmacion de eliminacion o error.
 */
router.delete('admin/eliminar-usuario/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { adminId } = req.body;

	//? 1.1 Revisamos que todos los parametros esten presentes (no nulos) y mayores a cero
	if (!userId || !adminId) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Datos de entrada no validos',
			offender: (!userId) ? 'userId' : (!adminId) ? 'adminId' : ''
		});
	}
	if (Number(userId) <= 0 || Number(adminId) <= 0) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] ID de usuario o administrador no valido',
			offender: (Number(userId) <= 0) ? 'userId' : 'adminId'
		});
	}

	//? 2. Ejecutamos el procedimiento interno
  try {
    const connection = await getConnection();
    await connection.execute(
            'CALL MiSeguroDigital.eliminarUnUsuarioAdminOnlyManual(?,?, @codigoResultado)',
            [userId, adminId]);
    const [resultCode] = await connection.execute('SELECT @ResultCode as codigo');
    await connection.end();

    const codigoSalida = Array.isArray(resultCode) && resultCode[0] ?
			(resultCode[0] as any).codigo : 500;

		//? 2.1 Retornamos informacion en base al id y el resultado en codigo
    if (codigoSalida === 200) {
      res.status(200).json({
        success: true,
        message: 'Usuario eliminado correctamente',
        offender: ''
      });
    } else if (codigoSalida === 404) {
      res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Usuario no encontrado',
        offender: 'userId'
      });
    } else if (codigoSalida === 403){
			res.status(403).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Acceso denegado, no se puede eliminar al unico admin registrado',
        offender: 'adminId'
      });
		}else {
      res.status(400).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] API Error al realizar la eliminacion de datos',
        offender: 'API Error'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor',
      offender: error
    });
  }
});

/**
 * @description Actualizar perfil propio del usuario autenticado. Esta ruta permite la modificacion basica
 * de la informacion de un usuario autenticado. Esta ruta esta disenada para ser usada desde el perfil de los
 * usuarios dado que internamente esto actualiza solo la informacion de usuarios
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.nombrePrim - Nuevo primer nombre del usuario (string).
 * @param {string} body.apellidoPrim - Nuevo primer apellido del usuario (string).
 * @param {string} body.fullNombre - Nuevo nombre completo del usuario (string).
 * @param {string} body.telefono - Nuevo telefono del usuario (string).
 * @param {string} body.fechaNacimiento - Nueva fecha de nacimiento del usuario (string).
 * @param {number} body.userId - ID del usuario que actualiza su propio perfil (numero).
 * @returns Retorna: confirmacion de actualizacion o error.
 */

//LISTO!!

router.put('/actualizar-mi-perfil', async (req: Request, res: Response) => {
  const { nombrePrim, apellidoPrim, fullNombre, telefono, fechaNacimiento, userId } = req.body;

  if (!nombrePrim || !apellidoPrim || !fullNombre || !telefono || !fechaNacimiento || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Datos de entrada no validos',
      offender: (!nombrePrim) ? 'nombrePrim' :
                (!apellidoPrim) ? 'apellidoPrim' :
                (!fullNombre) ? 'fullNombre' :
                (!telefono) ? 'telefono' :
                (!fechaNacimiento) ? 'fechaNacimiento' : 'userId'
    });
  }

  if (Number(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] ID de usuario no valido',
      offender: 'userId'
    });
  }

  try {
    const connection = await getConnection();

    await connection.execute(
      'CALL MiSeguroDigital.actualizarUnUsuarioDesdeAdminOUsuario(?,?,?,?,?,?,?,?,?,@codigoResultado)',
      [
        userId,
        nombrePrim,
        apellidoPrim,
        fullNombre,
        telefono,
        fechaNacimiento,
        'global_user',
        'user',
        userId,
      ]
    );

    const [rows] = await connection.execute(
      'SELECT @codigoResultado AS codigo'
    );

    await connection.end();

    const codigo =
      Array.isArray(rows) && rows[0]
        ? (rows[0] as any).codigo
        : 500;

    if (codigo === 200) {
      return res.status(200).json({
        success: true,
        message: 'Perfil actualizado correctamente',
        offender: ''
      });
    } else if (codigo === 404) {
      return res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Usuario no encontrado',
        offender: 'userId'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] API Error al realizar la actualizacion de datos',
        offender: 'API Error'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor',
      offender: error
    });
  }
});


/**
 * @description Obtener usuarios filtrados por rol. Esta ruta esta validada para solo el grupo de usuarios de administracion.
 * En este caso la idea es mostrar el listado de usuarios registrados totales con sus respectivos roles. estos
 * son todos los usuarios de la aplicaion, lo que significa que no es para los brokers, sino para los global_admin y global_superadmins
 * administradores del sistema.
 * @param {object} body - Cuerpo de la llamada al endpoint.
 * @param {string} body.rol - Rol a filtrar (string).
 * @returns Retorna: lista de usuarios con el rol especificado.
 */
router.get('/admin/usuarios-por-rol', async (req: Request, res: Response) => {
  const { rol } = req.body;

	//? 1. Validamos que el rol no sea nulo y pertenezca a los roles permitidos
	if (!rol || !['global_admin', 'global_superadmin','global_user'].includes(rol)) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Rol de usuario no valido',
			offender: 'rol'
		});
	}

	//? 2. Ejecutamos el procedimiento interno

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
        res.status(200).json({
					success: true,
					message: 'Usuarios encontrados',
					offender: '',
					data: arrayOfUserJsons
				})
    } else {
       res.status(404).json({
				 success: false,
				 message: 'No se encontraron usuarios con el rol especificado',
				 offender: '',
				 data: []
			 })
    }
  } catch (error) {
    res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		});
  }
});

/**
 * @description Obtener todos los usuarios registrados en el sistema. Esta ruta filtra internamente
 * para mostrar solo usuarios con rol 'global_user' y retorna el listado completo.
 * @returns Retorna: lista de todos los usuarios registrados con rol global_user.
 */



router.get('/admin/usuarios-registrados', async (req: Request, res: Response) => {
	try {
		const connection = await getConnection();
		const [rows] = await connection.execute(
			'SELECT * FROM MiSeguroDigital.usuarios_por_rol_view WHERE role_name = ?',
			['global_user']
		);
		await connection.end();

		//? Armamos el json de respuesta por cada fila
		let arrayOfUserJsons = Array.isArray(rows) ? rows.map((row: any) => ({
			id_usuario: row.id_usuario,
			correo_registro: row.email,
			nombre_primario: row.nombre_prim_usuario,
			apellido_primario: row.apellido_prim_usuario,
			nombre_completo: row.full_nombre_usuario,
			telefono: row.numero_telefono_usuario,
			estado_registro: row.is_active,
			fecha_registro: row.created_at,
			rol_usuario: row.role_name,
		})) : [];

		if (arrayOfUserJsons.length > 0) {
			res.status(200).json({
				success: true,
				message: 'Usuarios registrados encontrados',
				offender: '',
				data: arrayOfUserJsons
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'No se encontraron usuarios registrados',
				offender: '',
				data: []
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		});
	}
});


export default router;