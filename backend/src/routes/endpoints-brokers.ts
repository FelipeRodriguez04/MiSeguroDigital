import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';
import { generateSalt, hashPassword } from '../config/moduloAutenticacionSimple';

const router = Router();

/**
 * @description Crear nuevo broker, en este caso este metodo se encarga de la creacion de un broker manualmente
 * desde el apartado de configuracion interno de la aplicacion.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.email - Correo electronico del broker (string).
 * @param {string} body.password - Contrasena del broker (string).
 * @param {string} body.nombrePrim - Primer nombre del broker (string).
 * @param {string} body.apellidoPrim - Primer apellido del broker (string).
 * @param {string} body.fullNombre - Nombre completo del broker (string).
 * @param {string} body.telefono - Telefono del broker (string).
 * @param {string} body.fechaNacimiento - Fecha de nacimiento del broker (string).
 * @param {number} body.aseguradoraId - ID de la aseguradora (numero).
 * @param {string} body.estadoBroker - Estado del broker (string) inicial, en este caso este puede ser entre 'activo',
 * o 'pendiente' dado que este significa que un broker debe ser aprobado o no, no puede iniciar como rechazado.
 * [ enum ('pendiente', 'activo', 'rechazado')]
 * @param {string} body.rolBroker - Rol del broker (string).
 *  [enum ('broker_superadmin', 'broker_admin', 'broker_analyst')]
 * @param {number} body.adminId - ID del administrador que crea el broker (numero).
 * @returns Retorna: ID del broker creado o error de registro.
 */
router.post('/admin/registrar-broker', async (req: Request, res: Response) => {
	const {
	  email, password,
	  nombrePrim, apellidoPrim,
	  fullNombre, telefono,
	  fechaNacimiento, aseguradoraId,
	  rolBroker, adminId
	} = req.body;
  
	let estadoBroker = req.body.estadoBroker;
  
	// 1. Validación de campos obligatorios
	if (
	  !email || !password || !nombrePrim || !apellidoPrim || !fullNombre ||
	  !telefono || !fechaNacimiento || !aseguradoraId || !rolBroker || !adminId
	) {
	  return res.status(400).json({
		success: false,
		message: 'Error Code 0x001 - [Raised] Existe uno o mas campos vacíos',
		offender: 'admin'
	  });
	}
  
	// 1.1 Validar ENUM de estadoBroker
	const validEstados = ['activo', 'pendiente', 'rechazado'];
	if (!validEstados.includes(estadoBroker)) {
	  return res.status(400).json({
		success: false,
		message: 'Error Code 0x001 - [Raised] El estado del broker no es valido, debe ser activo, pendiente o rechazado',
		offender: 'estadoBroker'
	  });
	}
  
	// 1.2 No permitir iniciar como rechazado
	if (estadoBroker === 'rechazado') {
	  return res.status(400).json({
		success: false,
		message: 'Error Code 0x001 - [Raised] No se puede registrar un broker rechazado desde el inicio',
		offender: 'estadoBroker'
	  });
	}
  
	// 1.3 Validar ENUM de rolBroker
	const validRoles = ['broker_superadmin', 'broker_admin', 'broker_analyst'];
	if (!validRoles.includes(rolBroker)) {
	  return res.status(400).json({
		success: false,
		message: 'Error Code 0x001 - [Raised] El rol del broker no es válido',
		offender: 'rolBroker'
	  });
	}
  
	// 1.4 Validar IDs no negativos
	if (aseguradoraId < 0 || adminId < 0) {
	  return res.status(400).json({
		success: false,
		message: 'Error Code 0x001 - [Raised] IDs no pueden ser negativos',
		offender: (aseguradoraId < 0) ? 'aseguradoraId' : 'adminId'
	  });
	}
  
	// 2. Crear broker
	try {
	  const connection = await getConnection();
	  const salt = generateSalt();
	  const hashedPassword = hashPassword(password, salt);
  
	  await connection.execute(
		'CALL MiSeguroDigital.crearBrokerManual(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @codigoResultado, @nuevoBrokerId)',
		[
		  email, hashedPassword, salt, nombrePrim, apellidoPrim,
		  fullNombre, telefono, fechaNacimiento, aseguradoraId,
		  estadoBroker, rolBroker, adminId
		]
	  );
  
	  const [resultado] = await connection.execute(
		'SELECT @codigoResultado as codigo, @nuevoBrokerId as brokerId'
	  );
  
	  await connection.end();
  
	  const { codigo, brokerId } =
		Array.isArray(resultado) && resultado[0]
		  ? resultado[0] as any
		  : { codigo: 500, brokerId: null };
  
	  if (codigo === 200) {
		return res.status(200).json({
		  success: true,
		  brokerIdCreado: brokerId,
		  message: 'Broker creado correctamente',
		  offender: ''
		});
	  }
  
	  if (codigo === 409) {
		return res.status(409).json({
		  success: false,
		  message: 'Error Code 0x001 - [Raised] El correo ya está registrado',
		  offender: 'email'
		});
	  }
  
	  if (codigo === 404) {
		return res.status(404).json({
		  success: false,
		  message: 'Error Code 0x001 - [Raised] Aseguradora no encontrada',
		  offender: 'aseguradoraId'
		});
	  }
  
	  return res.status(400).json({
		success: false,
		message: 'Error Code 0x001 - [Raised] Error al crear broker',
		offender: 'API Error'
	  });
  
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: 'Error Code 0x001 - [Raised] Error interno del servidor',
		offender: error
	  });
	}
  });
  

/**
 * @description Actualizar broker existente. Esta ruta esta disenada para ser manejada por administradores
 * de tipo broker_superadmin o broker_admin dado que permite cambiar el rol del broker.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.brokerId - ID del broker (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.nombrePrim - Primer nombre del broker (string).
 * @param {string} body.apellidoPrim - Primer apellido del broker (string).
 * @param {string} body.fullNombre - Nombre completo del broker (string).
 * @param {string} body.telefono - Telefono del broker (string).
 * @param {string} body.rolBrokerNuevo - Rol del broker (string), en este caso el valor a representar aqui
 * puede ser de 'broker_analyst','broker_superadmin','broker_admin', etc. En este caso, la idea es que este
 * valor permite actualizar un broker y su rol directamente.
 * @param {string} body.fechaNacimiento - Fecha de nacimiento del broker (string).
 * @param {number} body.adminId - ID del administrador que actualiza (numero).
 * @returns Retorna: confirmacion de actualizacion o error.
 */
router.put('/admin/actualizar-datos/:brokerId', async (req: Request, res: Response) => {
  const { brokerId } = req.params;
  const { nombrePrim, apellidoPrim,
        fullNombre, telefono, 
        fechaNacimiento, estadoBroker, adminId,
        rolBrokerNuevo } = req.body;

	//? 1.1 Validamos que todos los datos esten ingresados, y retornamos 400 si alguno falta con el primer offender
	if (!nombrePrim || !apellidoPrim || !fullNombre ||
		!telefono || !fechaNacimiento || !rolBrokerNuevo || !adminId) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Existe uno o mas campos que se encuentran vacios en la request',
			offender: (!nombrePrim)? 'nombrePrim' : (!apellidoPrim)? 'apellidoPrim' : (!fullNombre)? 'fullNombre' :
				(!telefono)? 'telefono' : (!fechaNacimiento)? 'fechaNacimiento' : (!rolBrokerNuevo)? 'rolBrokerNuevo' : 'adminId'
		});
	}

	//? 1.2 Validamos que el rol del broker nuevo sea un enum valido, y retornamos 400 si no es asi
	if (!['broker_analyst', 'broker_superadmin', 'broker_admin'].includes(rolBrokerNuevo)) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El rol del broker no es valido, debe ser broker_analyst, broker_superadmin o broker_admin',
			offender: 'rolBrokerNuevo'
		});
	}

	//? 1.3 Revisamos si los ids del broker y dle admin son mayores que cero
	// @ts-ignore
	if (Number.parseInt(brokerId) < 0 || adminId < 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Los ids no deben ser negativos',
			// @ts-ignore
			offender: (Number.parseInt(brokerId) < 0)? 'brokerId' : 'adminId'
		});
	}

	//? 2. Procedemos a actualizar el broker en este caso la actualizacion es de toda la data, aunque se
	//? puede manejar desde el frontend que se mande la misma data original sin problema
  try {
    const connection = await getConnection();
    
    await connection.execute(
      'CALL MiSeguroDigital.actualizarBrokerManual(?, ?, ?, ?, ?, ?,?, ?, ?,?, @codigoResultado)',
      [brokerId, nombrePrim, apellidoPrim, fullNombre, telefono, 
          fechaNacimiento, estadoBroker, rolBrokerNuevo, 'broker_admin', adminId]
    );
    
    const [resultadoAcutalizacionAdmin] =
			await connection.execute('SELECT @codigoResultado as codigo');
    await connection.end();
    
    const codigo =
			Array.isArray(resultadoAcutalizacionAdmin)
			&& resultadoAcutalizacionAdmin[0] ? (resultadoAcutalizacionAdmin[0] as any).codigo : 500;

		//? 3. Retornamos la respuesta segun el codigo de la consulta
    if (codigo === 200) {
      return res.status(200).json({
				success: true,
				message: 'Broker actualizado correctamente',
				offender: ''
			});
    } else if (codigo === 404) {
      return res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Broker no encontrado en el registro',
				offender: 'brokerId'
			});
    } else {
      return res.status(400).json({
				success: false,
				message: 'Error al actualizar broker',
				offender: 'Error Code 0x001 - [Raised] API Error'
			});
    }
  } catch (error) {
    return res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		});
  }
});

/**
 * @description Actualizar broker existente.Esta ruta esta disenada para ser hablitada para todos los usuarios
 * de tipo broker dado que no modifiacn la data del rol del broker y por tanto no afecta tanto a la app
 * solo afectan a la data original. En este caso la llamada a la bdd es la misma, solo cambia un identificador
 * @param {object} params - Parametros de la URL.
 * @param {number} params.brokerId - ID del broker (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.nombrePrim - Primer nombre del broker (string).
 * @param {string} body.apellidoPrim - Primer apellido del broker (string).
 * @param {string} body.fullNombre - Nombre completo del broker (string).
 * @param {string} body.telefono - Telefono del broker (string).
 * @param {string} body.fechaNacimiento - Fecha de nacimiento del broker (string).
 * @param {string} body.rolBrokerActual - Rol actual del broker (string), en este caso el valor a representar aqui
 * es parte del enum 'broker_analyst','broker_superadmin','broker_admin', etc.
 * @param {number} body.adminId - ID del administrador que actualiza (numero).
 * @returns Retorna: confirmacion de actualizacion o error.
 */
router.put('/actualizar-datos/:brokerId', async (req: Request, res: Response) => {
	const { brokerId } = req.params;
	const { nombrePrim, apellidoPrim, fullNombre, telefono, fechaNacimiento, rolBrokerActual, adminId} = req.body;

	//? 1.1 Revisamos que toda la data este definida
	if (!nombrePrim || !apellidoPrim || !fullNombre || !telefono || !fechaNacimiento || !adminId || !rolBrokerActual) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Existe uno o mas campos que se encuentran vacios en la request',
			offender: (!nombrePrim)? 'nombrePrim' : (!apellidoPrim)? 'apellidoPrim' : (!fullNombre)? 'fullNombre' :
				(!telefono)? 'telefono' : (!fechaNacimiento)? 'fechaNacimiento' : (!rolBrokerActual)? 'rolBrokerActual' : 'adminId'
		});
	}
	//? 1.2 Revisamos que los ids del broker y del admin no sean negativos
	// @ts-ignore
	if (Number.parseInt(brokerId) < 0 || adminId < 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Los ids no deben ser negativos',
			// @ts-ignore
			offender: (Number.parseInt(brokerId) < 0)? 'brokerId' : 'adminId'
		});
	}
	//? 2. Procedemos a actualizar el broker en este caso la actualizacion es de toda la data, aunque se
	//? puede manejar desde el frontend que se mande la misma data original sin problema
	try {
		const connection = await getConnection();

		await connection.execute(
			`CALL MiSeguroDigital.actualizarBrokerManual(
				?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @codigoResultado
			)`,
			[
			  brokerId,
			  nombrePrim,
			  apellidoPrim,
			  fullNombre,
			  telefono,
			  fechaNacimiento,
			  rolBrokerActual,
			  'activo',         // estadoBroker
			  'broker_admin',   // rolModificador
			  adminId
			]
		  );
		  

		const [resultadoAcutalizacion] = await connection.execute('SELECT @codigoResultado as codigo');
		await connection.end();

		//? 2.1 Obtenemos el codigo luego de la actualizacion
		const codigo = Array.isArray(resultadoAcutalizacion) && resultadoAcutalizacion[0]
			? (resultadoAcutalizacion[0] as any).codigo : 500;

		if (codigo === 200) {
			res.status(200).json({
				success: true,
				message: 'Broker actualizado correctamente',
				offender: ''
			});
		} else if (codigo === 404) {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Broker no encontrado en el registro',
				offender: 'brokerId'
			})
		} else {
			res.status(400).json({
				success: false,
				message: 'Error al actualizar broker',
				offender: 'Error Code 0x001 - [Raised] API Error'
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		})
	}

});


/**
 * @description Eliminar broker.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.brokerId - ID del broker (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.adminId - ID del administrador que elimina (numero).
 * @returns Retorna: confirmacion de eliminacion o error.
 */
router.delete('/admin/eliminar-broker/:brokerId', async (req: Request, res: Response) => {
  const { brokerId } = req.params;
  const { adminId } = req.body;

	//? 1.1 Validamos que los parametros ingresados no sean nulos
	if (!brokerId || !adminId) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Existe uno o mas campos que se encuentran vacios en la request',
			offender: (!brokerId)? 'brokerId' : 'adminId'
		});
	}

	//? 1.2 Revisamos que los ids del broker y del admin no sean negativos
	if (Number.parseInt(brokerId) < 0 || adminId < 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Los ids no deben ser negativos',
			offender: (Number.parseInt(brokerId) < 0)? 'brokerId' : 'adminId'
		});
	}

	//? 2. Procedemos a eliminar el broker
  try {
    const connection = await getConnection();
    
    await
        connection
            .execute(
                'CALL MiSeguroDigital.eliminarBrokerManual(?, ?, @codigoResultado)',
                [brokerId, adminId]);
    
    const [result] =
			await connection.execute(
				'SELECT @codigoResultado as codigo');
    await connection.end();
    
    const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;
    
    if (codigo === 200) {
      res.json({
				success: true,
				message: 'Broker eliminado correctamente',
				offender: ''
			});
    } else if (codigo === 404) {
      res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Broker no encontrado',
				offender: 'brokerId'
			});
    } else {
      res.status(400).json({
				success: false,
				message: 'Error al eliminar broker',
				offender: 'Error Code 0x001 - [Raised] API Error'
			});
    }
  } catch (error) {
    res.status(500).json({
			success: false,
			message: 'Error interno del servidor',
			offender: error
		});
  }
});

/**
 * @description Actualizar estado de broker (aprobar/rechazar). Este endpoint es solo de admnistracion
 * ya que permite activar o mantener desactivada una cuenta. Si se aprueba, entonces el regisro pasa
 * @param {object} params - Parametros de la URL.
 * @param {number} params.brokerId - ID del broker (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.accionARealizar - Define la accion a realizar, sea aprobar o rechazar (string) que se va a enviar
 * a la API
 * @param {string} body.rolInicial - Este rol inicial es el rol que se configura desde la creacion del admin. En este caso
 * para pasar la informacion a este endpoint se tiene que hacer desde una pantalla que tenga los datos
 * de las aplicaciones recientes
 * @param {number} body.adminId - ID del administrador que aprueba/rechaza (numero).
 * @returns Retorna: confirmacion de cambio de estado o error.
 */
router.put('/admin/actualizar-estado-broker/:brokerId', async (req: Request, res: Response) => {
  const { brokerId } = req.params;
  let { accionARealizar, rolInicial, adminId } = req.body;

  //? 1.1 Validamos que todos los datos esten ingresados, y retornamos 400 si alguno falta con el primer offender
	if (!accionARealizar || !rolInicial || !adminId || !brokerId) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Existe uno o mas campos que se encuentran vacios en la request',
			offender: (!accionARealizar)? 'accionARealizar' : (!rolInicial)? 'rolInicial' :
				(!adminId)? 'adminId' : 'brokerId'
		});
	}

	//? 1.2 Validamos que el rol del broker nuevo sea un enum valido, y retornamos 400 si no es asi
	if (!(rolInicial in ['broker_analyst', 'broker_superadmin', 'broker_admin'])) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El rol del broker no es valido, debe ser broker_analyst, broker_superadmin o broker_admin',
			offender: 'rolInicial'
		});
	}

	//? 1.3 Revisamos que los ids del broker y del admin no sean negativos
	if (Number.parseInt(brokerId) < 0 || adminId < 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Los ids no deben ser negativos',
			offender: (Number.parseInt(brokerId) < 0)? 'brokerId' : 'adminId'
		});
	}

	//? 2. Procedemos a actualizar el estado del broker
  try {
    const connection = await getConnection();
    
    await connection
        .execute(
            'CALL MiSeguroDigital.aprobarORechazarBrokerManual(?, ?, ?, ?, @codigoResultado)',
            [brokerId, accionARealizar, rolInicial, adminId]);

    const [result, ] = await connection.execute('SELECT @codigoResultado as codigo');

    await connection.end();

    //? 2. Extraemos el codigo para saber si la actualizacion fue exitosa
    const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;
    
    if (codigo === 200) {
      res.json({
				success: true,
				message: 'Estado del broker actualizado correctamente',
				offender: ''
			});
    } else if (codigo === 404) {
      res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Broker no encontrado',
				offender: 'brokerId'
			});
    } else if (codigo === 409) {
			res.status(409).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] El broker ya esta activo',
				offender: ''
			});
		}else {
      res.status(400).json({ 
				success: false, 
				message: 'Error Code 0x001 - [Raised] API Error al actualizar al broker',
				offender: "API ERror"
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
 * @description Obtener perfil de broker por ID. Esta ruta esta habilitada para todos tanto admins
 * como para brokers normales ya que solo retorna los datos del broker en cuestion.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.brokerId - ID del broker (numero).
 * @returns Retorna: datos del perfil del broker en formato JSON.
 */

//LISTO!!

router.get('/obtener-datos/:brokerId', async (req: Request, res: Response) => {
  const { brokerId } = req.params;

  if (!brokerId) {
    return res.status(400).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] El brokerId no puede estar vacío',
      offender: 'brokerId'
    });
  }

  if (Number.parseInt(brokerId) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] El brokerId no puede ser negativo',
      offender: 'brokerId'
    });
  }

  try {
    const connection = await getConnection();

    const [dataBroker]: any = await connection.execute(
      'CALL MiSeguroDigital.getBrokerDataPerBrokerID(?, @ResultCode)',
      [brokerId]
    );

    const [resultCode]: any = await connection.execute(
      'SELECT @ResultCode AS codigo'
    );

    await connection.end();

    const codigo = resultCode?.[0]?.codigo ?? 500;

    let rows: any[] = [];

    if (Array.isArray(dataBroker)) {
      if (Array.isArray(dataBroker[0])) {
        rows = dataBroker[0]; 
      } else {
        rows = dataBroker; 
      }
    }

    if (codigo === 200 && rows.length > 0) {
      const brokerData = rows[0];

      return res.status(200).json({
        success: true,
        data: {
          id_broker: brokerData.id_broker,
          email: brokerData.email,
          nombre_prim_broker: brokerData.nombre_prim_broker,
          apellido_prim_broker: brokerData.apellido_prim_broker,
          full_nombre_broker: brokerData.full_nombre_broker,
          numero_telefono_broker: brokerData.numero_telefono_broker,
          fecha_nacimiento_broker: brokerData.fecha_nacimiento_broker,
          estado_broker: brokerData.estado_broker,
          is_active: brokerData.is_active,
          created_at: brokerData.created_at,
          aseguradora: {
            id_aseguradora: brokerData.id_aseguradora,
            nombre_aseguradora: brokerData.nombre_aseguradora,
            dominio_correo_aseguradora: brokerData.dominio_correo_aseguradora
          },
          broker_role: brokerData.broker_role
        },
        message: 'Datos del broker obtenidos correctamente'
      });
    }

    if (codigo === 404) {
      return res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Broker no encontrado',
        offender: 'brokerId'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error al obtener datos del broker',
      offender: 'API Error'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor',
      offender: error
    });
  }
});



/**
 * @description Ruta disenada para obtener el listado de todos los brokers
 * registrados en la aplicacion ordenados por su estado. En este caso,la informacion que trae es la mas completa
 * este listado tiene el tipo de rol que tiene el broker y el estado del broker.
 * @returns Retorna: listado de brokers ordenados por estado.
 */
router.get('/admin/listado-brokers-historico', async (req: Request, res: Response) => {
	//? 1. Como no tenemos ningun parametros solo ingresamos a trabajar
	try {
		const connection = await getConnection();

		const [resultingBrokers] = await
			connection.execute('select * from MiSeguroDigital.viewBrokerInfoBasica');

		await connection.end();

		//? 1.1 Basados en la data retornada, convertimos la tabla en un arreglo de entidades de json con
		// todos los datos
		let arrayOfHistoricBrokers = Array.isArray(resultingBrokers) ? resultingBrokers.map((broker: any) => ({
			id_broker: broker.id_broker,
			email: broker.email,
			nombre_prim_broker: broker.nombre_prim_broker,
			apellido_prim_broker: broker.apellido_prim_broker,
			full_nombre_broker: broker.full_nombre_broker,
			numero_telefono_broker: broker.numero_telefono_broker,
			fecha_nacimiento_broker: broker.fecha_nacimiento_broker,
			estado_broker: broker.estado_broker,
			is_active: broker.is_active,
			created_at: broker.created_at,
			id_aseguradora: broker.id_aseguradora,
			nombre_aseguradora: broker.nombre_aseguradora,
			dominio_correo_aseguradora: broker.dominio_correo_aseguradora,
			broker_role: broker.broker_role
		})) : [];

		//? 1.2 Si tenemos data enviamos la respuesta
		if (arrayOfHistoricBrokers.length > 0) {
			res.status(200).json({
				success: true,
				data: arrayOfHistoricBrokers,
				message: 'Listado de brokers obtenido correctamente'
			});
		} else {
			res.status(404).json(
				{
					success: false,
					message: 'Error Code 0x001 - [Raised] No se encontraron brokers registrados',
					offender: ''
				});
		}
	} catch (error){
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		})
	}
});


/**
 * @description Ruta disenada para obtener el lsitado de todos los brokers activos o inactivos
 * pero con su data reducida, lo que puede servir para una visualizacion reducida o para un
 * exporte de datos.
 * @returns Retorna: listado de brokers ordenados por estado.
 */
router.get('/admin/listado-brokers-historico-mini', async (req: Request, res: Response) => {
	//? 1. Como no tenemos ningun parametros solo ingresamos a trabajar
	try {
		const connection = await getConnection();

		const [resultingBrokers] = await
			connection.execute('select * from MiSeguroDigital.viewBrokersAgrupadosPorEstadoBroker');

		await connection.end();

		//? 1.1 Basados en la data retornada, convertimos la tabla en un arreglo de entidades de json con
		// todos los datos
		let arrayOfHistoricBrokers = Array.isArray(resultingBrokers) ? resultingBrokers.map((broker: any) => ({
			estado_broker: broker.estado_broker,
			id_broker: broker.id_broker,
			email: broker.email,
			nombre_prim_broker: broker.nombre_prim_broker,
			apellido_prim_broker: broker.apellido_prim_broker,
			full_nombre_broker: broker.full_nombre_broker,
			numero_telefono_broker: broker.numero_telefono_broker,
			application_date: broker.application_date,
			nombre_aseguradora: broker.nombre_aseguradora,
			dominio_correo_aseguradora: broker.dominio_correo_aseguradora,
			current_role: broker.current_role,
			has_role_assigned: broker.has_role_assigned
		})) : [];


		//? 1.2 Si tenemos data enviamos la respuesta
		if (arrayOfHistoricBrokers.length > 0) {
			res.status(200).json({
				success: true,
				data: arrayOfHistoricBrokers,
				message: 'Listado de brokers obtenido correctamente'
			});
		} else {
			res.status(404).json(
				{
					success: false,
					message: 'Error Code 0x001 - [Raised] No se encontraron brokers registrados',
					offender: ''
				});
		}
	} catch (error){
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		})
	}
})

/**
 * @description Ruta para obtener el listado de todas las aplicaciones a polizas que tiene registrado
 * una compania. En este caso podemos usar la informacion del usuario para filtrar por el id de la
 * aseguradora en donde trabaja el broker.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.id_aseguradora - ID de la aseguradora (numero), esta data se retorna cuando se carga
 * el perfil del broker usando el perfil para llamar a sus datos. Esta data no se carga directamente en el login.
 * @returns Retorna: listado de aplicaciones a polizas registradas por el broker.
 */
router.get('/admin/listado-aplicaciones-pendientes-por-aseguradora/:id_aseguradora', async (req: Request, res: Response) => {
	const { id_aseguradora } = req.params;

	//? 1. validamos que la data exizsta y no sea menor que cero en el mismo if
	if (!id_aseguradora || Number.parseInt(id_aseguradora) <= 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Existe uno o mas campos que se encuentran vacios en la request',
			offender: 'id_aseguradora'
		});
	}

	//? 2. Procedemos a obtener los datos del broker
    try {
        const connection = await getConnection();

				const [resultingApplications] = await connection.execute(
				'select * from viewAplicacionesPendientesPorBroker where id_aseguradora = ?',
					[id_aseguradora]);

				await connection.end();

				//? 2.1 Basados en la data retornada, convertimos la tabla en un arreglo de entidades de json con
				// todos los datos
			let arrayOfApplications = Array.isArray(resultingApplications) ? resultingApplications.map((application: any) => ({
				id_aplicacion_poliza: application.id_aplicacion_poliza,
				fecha_de_aplicacion: application.fecha_de_aplicacion,
				estado_actual_aplicacion: application.estado_actual_aplicacion,
				id_usuario: application.id_usuario,
				full_nombre_usuario: application.full_nombre_usuario,
				email_usuario: application.email_usuario,
				id_poliza: application.id_poliza,
				nombre_de_la_poliza: application.nombre_de_la_poliza,
				id_aseguradora: application.id_aseguradora,
				nombre_aseguradora: application.nombre_aseguradora
			})) : [];

			//? 2.2 Retornamos si no esta vacia
			if (arrayOfApplications.length > 0) {
				res.status(200).json({
					success: true,
					data: arrayOfApplications,
					message: 'Listado de aplicaciones a polizas obtenido correctamente'
				});
			} else {
				res.status(404).json(
					{
						success: false,
						message: 'Error Code 0x001 - [Raised] No se encontraron aplicaciones pendientes por aseguradora',
						offender: ''
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
 * @description Ruta para obtener el reporte de performance total de una aseguradora, en este caso
 * la idea es retornar un pequeno detalle del performance actual de la aseguradora para poder reportar esto
 * en una impresion en pantalla, etc.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.id_aseguradora - ID de la aseguradora (numero), esta data se retorna cuando se carga
 * el perfil del broker usando el perfil para llamar a sus datos. Esta data no se carga directamente en el login.
 * @returns Retorna: reporte de performance total de una aseguradora.
 */
router.get('/admin/reporte-performance-total-aseguradora/:id_aseguradora', async (req: Request, res: Response) => {
	const { id_aseguradora } = req.params;

	//? 1.1 Validamos si la data no es nula y si el id es mayor que cero
	if (!id_aseguradora || Number.parseInt(id_aseguradora) <= 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Existe uno o mas campos que se encuentran vacios en la request',
			offender: 'id_aseguradora'
		});
	}

	//? 2. Ejecutamos la query
	try {
		const connection = await getConnection();

			const [resultingPerformance] = await connection.execute(
				'select * from viewEstadisticasDeSolicitudesReporteParaBrokers where id_aseguradora = ?',
				[id_aseguradora]);

			await connection.end();

			//? 2.1 Basados en la data retornada, convertimos la tabla en un arreglo de entidades de json con
			// todos los datos
			let arrayOfPerformance = Array.isArray(resultingPerformance) ? resultingPerformance.map((performance: any) => ({
				id_aseguradora: performance.id_aseguradora,
				nombre_aseguradora: performance.nombre_aseguradora,
				total_aplicaciones: performance.total_aplicaciones,
				aplicaciones_pendientes: performance.aplicaciones_pendientes,
				aplicaciones_aprobadas: performance.aplicaciones_aprobadas,
				aplicaciones_rechazadas: performance.aplicaciones_rechazadas,
			})) : [];

			//? 2.2 Retornamos si no esta vacia
			if (arrayOfPerformance.length > 0) {
				res.status(200).json({
					success: true,
					data: arrayOfPerformance,
					message: 'Reporte de performance total de la aseguradora obtenido correctamente'
				});
			} else {
				res.status(404).json(
					{
						success: false,
						message: 'Error Code 0x001 - [Raised] No se encontraron aplicaciones pendientes por aseguradora',
						offender: ''
					});
			}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		});
	}
})


export default router;