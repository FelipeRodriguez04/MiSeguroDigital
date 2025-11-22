import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Crear nueva aplicacion de poliza.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.usuarioId - ID del usuario (numero).
 * @param {number} body.polizaId - ID de la poliza (numero).
 * @param {number} body.bienId - ID de la poliza (numero).
 * @returns Retorna: confirmacion de creacion o error.
 */
router.post('/usuarios/crear-aplicacion-a-poliza', async (req: Request, res: Response) => {
  const { usuarioId, polizaId, bienId } = req.body;

	//? 1. Validamos la entrada de datos para que existan los ids (no sean nulos) y que sean mayores que cero
	if (!usuarioId || !polizaId || !bienId || usuarioId <= 0 || polizaId <= 0 || bienId <= 0) {
		res.status(400).json(
			{
				success: false,
				message: 'Error Code 0x001 - [Raised] Los parametros de entrada son invalidos, se enviaron valores nulos o negativos',
				offender: (!usuarioId) ? 'ID de usuario' : (!polizaId) ? 'ID de poliza' : 'ID de bien'
			}
		);
	}
	//? 2. Conitnuamos con la query normal
  try {
    const connection = await getConnection();
    await
        connection.execute(
            'CALL MiSeguroDigital.crearAplicacionEnPolizaPorUsuario(?, ?, ?, @codigoResultado)',
            [usuarioId, polizaId, bienId]
        );

    const [result] = await connection.execute('SELECT @codigoResultado as codigo');
    await connection.end();

    const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;

    if (codigo === 200) {
      res.status(200).json({
					success: true,
					message: 'Aplicacion creada correctamente',
					offender: ''
			});
    } else if (codigo == 404){
        res.status(404).json({
					success: false,
					message: 'Error Code 0x001 - [Raised] Error al crear aplicacion: No se encontraron datos de la poliza o bien especificado',
					offender: "idPoliza o idUsuario o idBien"

				});
    } else {
        res.status(codigo).json({
					success: false,
					message: 'Error Code 0x001 - [Raised] Error al crear aplicacion: Error interno del servidor',
					offender: ""
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
 * @description Obtener aplicaciones de un usuario especifico.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario (numero).
 * @returns Retorna: lista de aplicaciones del usuario.
 */

//LISTO!!

router.get('/usuarios/aplicaciones-de-usuario/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
	//? 1. Revisamos entradas de datos para ver que el id del usuario no este vacio
	if (!userId || Number.parseInt(userId) <= 0) {
		res.status(400).json(
			{ message: 'El ID del usuario es requerido, se lo paso en blanco' }
		);
		return;
	}
	//? 2. Continuams con el proceso normal
  try {
    const connection = await getConnection();
    const [rows] = await
        connection.execute(
            'SELECT * FROM MiSeguroDigital.viewAplicacionesPolizaPorUsuario WHERE id_usuario = ?',
            [userId]
        );
    await connection.end();
    
    let arrayOfPolizas = Array.isArray(rows) ? rows.map((poliza: any) => (
        {
            id_poliza: poliza.id_aplicacion_poliza,
            fecha_aplicacion_poliza: poliza.fecha_de_aplicacion,
            estado_actual_aplicacion:  poliza.estado_actual_aplicacion,
            nombre_poliza: poliza.nombre_de_la_poliza,
            tipo_poliza: poliza.tipo_de_poliza,
            nombre_aseguradora: poliza.nombre_aseguradora
        }
    )): [];
    if (arrayOfPolizas.length === 0) {
        res.status(404).json({ message: 'No se encontraron aplicaciones para el usuario especificado' });
    } else {
        res.status(200).json(arrayOfPolizas);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @description Obtener aplicaciones aprobadas de un usuario especifico.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario (numero).
 */
router.get('/usuarios/aplicaciones-aceptadas-usuario/:userId', async (req: Request, res: Response) => {
	const { userId } = req.params;
	//? 1. Revisamos entradas de datos para ver que el id del usuario no este vacio
	if (!userId || Number.parseInt(userId) <= 0) {
		res.status(400).json(
			{ message: 'El ID del usuario es requerido, se lo paso en blanco' }
		);
		return;
	}
	//? 2. Continuams con el proceso normal
	try {
		const connection = await getConnection();
		const [rows] = await
			connection.execute(
				'SELECT * FROM MiSeguroDigital.viewAplicacionesPolizaPorUsuario WHERE id_usuario = ? and estado_actual_aplicacion = \'aprobada\'',
				[userId]
			);
		await connection.end();

		//? En base a la respuesta creamos un  JSON especifico para el frontend
		let arrayOfPolizas = Array.isArray(rows) ? rows.map((poliza: any) => (
			{
				id_poliza: poliza.id_aplicacion_poliza,
				fecha_aplicacion_poliza: poliza.fecha_de_aplicacion,
				estado_actual_aplicacion:  poliza.estado_actual_aplicacion,
				nombre_poliza: poliza.nombre_de_la_poliza,
				tipo_poliza: poliza.tipo_de_poliza,
				nombre_aseguradora: poliza.nombre_aseguradora
			}
		)): [];
		if (arrayOfPolizas.length === 0) {
			res.status(404).json({ message: 'No se encontraron aplicaciones para el usuario especificado' });
		} else {
			res.status(200).json(arrayOfPolizas);
		}
	} catch (error) {
		res.status(500).json({ message: 'Error interno del servidor' });
	}
})

/**
 * @description Obtener aplicaciones pendientes para revision de broker.
 * @note Sin parametros.
 * @returns Retorna: lista de aplicaciones pendientes de aprobacion.
 */
router.get('/brokers/aplicaciones-pendientes', async (req: Request, res: Response) => {
  try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM MiSeguroDigital.viewAplicacionesPendientesPorBroker');
        await connection.end();
    
        //? 1. Con la salida de la query, transformamos la data en un array de objetos de JSON
        let arrayOfApplications = Array.isArray(rows) ? rows.map((application: any) => ({
            id_aplicacion_poliza: application.id_aplicacion_poliza,
            fecha_aplicacion_poliza: application.fecha_de_aplicacion,
            estado_actual_aplicacion: application.estado_actual_aplicacion,
            id_usuario_aplicacion: application.id_usuario,
            full_nombre_usuario_aplicacion: application.full_nombre_usuario,
            correo_registro_usuario_aplicaicon: application.email_usuario,
            id_poliza_aplicacion: application.id_poliza,
            nombre_poliza_aplicacion: application.nombre_de_la_poliza,
            id_aseguradora_poliza_aplicacion: application.id_aseguradora,
            nombre_aseguradora_poliza_aplicacion: application.nombre_aseguradora
        })) : [];

        if (arrayOfApplications.length === 0) {
            res.status(404).json({ message: 'No se encontraron aplicaciones pendientes de aprobacion' });
        } else {
            res.status(200).json(arrayOfApplications);
        }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @description Procesar aplicacion (aprobar o rechazar).
 * @param {object} params - Parametros de la URL.
 * @param {number} params.applicationId - ID de la aplicacion (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.brokerAnalistaId - ID del broker analista (numero).
 * @param {string} body.decision - Decision sobre la aplicacion (string). Tiene que ser del tipo enum
 * perteneciente a [enum ('aprobada', 'rechazada')].
 * @param {string} [body.razonRechazo] - Razon de rechazo (string opcional).
 * @returns Retorna: confirmacion de procesamiento o error.
 */
router.put('/brokers/procesar-aplicacion/:applicationId', async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const { brokerAnalistaId, decision, razonRechazo } = req.body;
    //? 1. Validamos que todos los parametros existan y que el enum se cumpla. La razon puede estar vacia
    if (!brokerAnalistaId || !decision && !(decision in ['aprobada', 'rechazada'])) {
        return res.status(400)
					.json(
						{ success: false,
							message: 'Parametros invalidos' });
    }
		if (decision === 'rechazada' && !razonRechazo) {
			return res.status(400)
				.json(
					{ success: false,
						message: 'Razon de rechazo es requerida para aplicacion rechazada' });
		}
		//? 2. Continuamos con el proceso normal
  try {

    const connection = await getConnection();
    await connection.execute(
      'CALL MiSeguroDigital.procesarAplicacionEnPolizaPorUsuario(?, ?, ?, ?, @codigoResultado)',
      [applicationId, brokerAnalistaId, decision, razonRechazo]
    );


    const [result] = await connection.execute('SELECT @codigoResultado as codigo ');
    await connection.end();
    
    const  codigo = Array.isArray(result) ? (result[0] as any) : 500

    if (codigo === 200) {
      res.status(200).json({ success: true, message: 'Aplicacion procesada correctamente' });
    } else if (codigo === 409){
			res.status(409)
				.json({ success: false,
					message: 'Error al procesar aplicacion: La aplicacion ya fue procesada' });
		}
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Obtener detalles completos de una aplicacion especifica con el usuario en mente,
 * la data que se envia no es completa como en el endpoint de brokers
 * @param {object} params - Parametros de la URL.
 * @param {number} params.applicationId - ID de la aplicacion (numero).
 * @param {number} params.userId - ID del usuario (numero).
 * @returns Retorna: detalles completos de la aplicacion incluyendo datos del usuario y poliza.
 */
router.get('/usuarios/obtener-detalles-aplicacion/:applicationId', async (req: Request, res: Response) => {
  const { applicationId, userId } = req.params;

	//? 1. Validamos que el id de la aplicacion no este vacio o sea menor que cero
	if (!applicationId || Number.parseInt(applicationId) <= 0) {
		res.status(400).json(
			{ message: 'El ID de la aplicacion es requerido, se lo paso en blanco o negativo' }
		);
	}
	if (!userId || Number.parseInt(userId) <= 0) {
		res.status(400).json(
			{ message: 'El ID del usuario es requerido, se lo paso en blanco o negativo' }
		);
	}

	//? 2. Continuamos con el proceso normal, en este caso segmentado para usuarios
  try {
    const connection = await getConnection();
    // OJO: con esta query filtramos los registros para un usuario especifico con una aplicacion especifica
		const [resultingRow] = await
			connection.execute('select * from MiSeguroDigital.viewAplicacionesPolizaPorUsuario where id_aplicacion_poliza = ? and id_usuario = ?',
				[applicationId]);
    await connection.end();

		//? 2.1 Sacamos los resultados de la query
		let arrayOfSingleApplication =
			Array.isArray(resultingRow) ? resultingRow.map((application: any) => ({
				fecha_de_aplicacion: application.fecha_de_aplicacion,
				estado_actual_aplicacion: application.estado_actual_aplicacion,
				/*No incluyo datos del usuario porque para hacer esto ya se tienen guardados en el browser*/
				nombre_de_la_poliza: application.nombre_de_la_poliza,
				tipo_de_poliza: application.tipo_de_poliza,
				descripcion_de_la_poliza: application.descripcion_de_la_poliza,
				pago_mensual_de_la_poliza: application.pago_mensual,
				monto_cobertura_total: application.monto_cobertura_total,
				nombre_aseguradora: application.nombre_aseguradora,
				cantidad_documentos_subidos: application.cantidad_documentos
			})) : [];
		if (arrayOfSingleApplication.length === 0) {
			res.status(404).json({ message: 'No se encontraron detalles de la aplicacion especificada' });
		} else {
			res.status(200).json(arrayOfSingleApplication);
		}
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


router.get('/brokers/obtener-detalles-aplicacion/:applicationId', async (req: Request, res: Response) => {
	const { applicationId, userId } = req.params;

	//? 1. Validamos que el id de la aplicacion no este vacio o sea menor que cero
	if (!applicationId || Number.parseInt(applicationId) <= 0) {
		res.status(400).json(
			{ message: 'El ID de la aplicacion es requerido, se lo paso en blanco o negativo' }
		);
	}
	if (!userId || Number.parseInt(userId) <= 0) {
		res.status(400).json(
			{ message: 'El ID del usuario es requerido, se lo paso en blanco o negativo' }
		);
	}

	//? 2. Continuamos con el proceso normal, en este caso segmentado para usuarios
	try {
		const connection = await getConnection();
		// OJO: con esta query filtramos los registros para un usuario especifico con una aplicacion especifica
		const [resultingRow] = await
			connection.execute('select * from MiSeguroDigital.viewAplicacionesPolizaPorUsuario where id_aplicacion_poliza = ? and id_usuario = ?',
				[applicationId]);
		await connection.end();

		//? 2.1 Sacamos los resultados de la query
		let arrayOfSingleApplication =
			Array.isArray(resultingRow) ? resultingRow.map((application: any) => ({
				id_aplicacion_poliza: application.id_aplicacion_poliza,
				fecha_de_aplicacion: application.fecha_de_aplicacion,
				estado_actual_aplicacion: application.estado_actual_aplicacion,
				id_usuario: application.id_usuario,
				full_nombre_usuario: application.full_nombre_usuario,
				correo_registro: application.correo_registro,
				numero_telefono_usuario: application.numero_telefono_usuario,
				fecha_nacimiento_usuario: application.fecha_nacimiento_usuario,
				id_poliza: application.id_poliza,
				nombre_de_la_poliza: application.nombre_de_la_poliza,
				descripcion_de_la_poliza: application.descripcion_de_la_poliza,
				pago_mensual: application.pago_mensual,
				monto_cobertura_total: application.monto_cobertura_total,
				nombre_aseguradora: application.nombre_aseguradora,
				cantidad_documentos: application.cantidad_documentos
			})) : [];

		if (arrayOfSingleApplication.length === 0) {
			res.status(404).json({ message: 'No se encontraron detalles de la aplicacion especificada' });
		} else {
			res.status(200).json(arrayOfSingleApplication);
		}
	} catch (error) {
		res.status(500).json({ message: 'Error interno del servidor' });
	}
})

/**
 * @description Formalizar registro de usuario en poliza despues de aprobacion.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.applicationId - ID de la aplicacion aprobada (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.brokerId - ID del broker que formaliza el registro (numero).
 * @returns Retorna: confirmacion de registro formalizado o error.
 */
router.post('broker/registrar-aprobacion-aplicacion/:applicationId', async (req: Request, res: Response) => {
  const { applicationId } = req.params;
	const { brokerId } = req.body;

	//? 1. Revisamos que el broker id y la application id no sean nulos ni que sean menores que cero
	if (!brokerId || !applicationId || brokerId <= 0 || Number.parseInt(applicationId) <= 0) {
		res.status(400).json(
			{
				message: 'Los datos de entrada son incorrectos',
				reason: (brokerId <= 0) ? 'El ID del broker no puede ser menor o igual a cero':
					'El ID de la aplicacion no puede ser menor o igual a cero'
			});
	}

	//? 2. Continuamos con el proceso normal
  try {
    const connection = await getConnection();
		const [result] =
			await connection.execute('call MiSeguroDigital.registrarUsuarioEnPolizaPorAplicacion(?, ?, @codigoResultado) ',
				[
				applicationId, brokerId
			])
    await connection.end();

		//? 1. Procesamos salida en forma de codigo de error
		const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;

		if (codigo === 404){
			res.status(404).json({ message: 'No se encontro la aplicacion definida' });
		} else if (codigo === 409) {
			res.status(409).json({ message: 'La aplicacion ya fue formalizada' });
		} else if (codigo ==  500) {
			res.status(500).json({ message: 'Error interno del servidor' });
		}else {
			res.status(200).json({ success: true, message: 'Registro formalizado correctamente' });
		}
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;