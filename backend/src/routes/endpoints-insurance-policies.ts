import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Obtener catalogo completo de polizas disponibles.
 * @note Sin parametros.
 * @returns Retorna: lista completa de polizas en el catalogo.
 */

//LISTO!!

router.get('/catalogo-completo', async (req: Request, res: Response) => {
	
	//? 1. COmo no hay parametros procedemos internamente con el proceso general
  try {
    const connection = await getConnection();
    const [resultadoQueryCatalogo] =
			await connection.execute(
				'SELECT * FROM MiSeguroDigital.viewPolizaCatalogoCompleto');
    await connection.end();
    
    //? 2. Como el retorno es una serie de rows de data, vamos a transformarlas en un objeto de JSON
      let arrayOfPolizas =
				Array.isArray(resultadoQueryCatalogo) ?
					resultadoQueryCatalogo.map((row: any) => ({
						id_poliza: row.id_poliza,
						nombre_poliza: row.nombre_de_la_poliza,
						descripcion: row.descripcion_de_la_poliza,
						tipo_poliza: row.tipo_de_poliza,
						pago_mensual: row.pago_mensual,
						monto_cobertura: row.monto_cobertura_total,
						duracion_contrato: row.duracion_de_contrato,
						porcentaje_aprobacion: row.porcentaje_de_aprobacion,
						importe_cancelacion: row.importe_por_cancelacion,
						nombre_aseguradora: row.nombre_aseguradora,
						id_aseguradora: row.id_aseguradora,
						estado_de_la_poliza: row.estado_de_poliza
    			})) : [];

    if (arrayOfPolizas.length > 0) {
      res.status(200).json({
				success: true,
				message: "Polizas encontradas, retornando conjunto de datos",
				polizas: arrayOfPolizas,
				offender: ''
			});
    } else {
      res.status(404).json({
				success: false,
				message: "Error Code 0x001 - [Raised] No se encontraron polizas para el usuario",
				polizas: [],
				offender: ''
			})
    }
  } catch (error) {
    res.status(500).json({
			success: false,
			message: "Error Code 0x001 - [Raised] Error interno del servidor",
			offender: error
		})
  }
});

/**
 * @description Buscar polizas por tipo especifico.
 * @param {object} query - Parametros de consulta.
 * @param {string} query.type - Tipo de poliza a buscar (string)
 * [enum('seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud')].
 * @returns Retorna: polizas que coinciden con el tipo especificado.
 */

//LiSTO!!

router.get('/catalogo/buscar-por-tipo', async (req: Request, res: Response) => {
	const { type } = req.query;

	//? 1. Validamos que el tipo este presente y sea un string valido
	if (!type || typeof type !== 'string') {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El tipo de poliza es requerido y debe ser un string',
			offender: 'type'
		});
	}

	//? 2. Validamos que el tipo pertenezca al enum permitido
	if (!['seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud'].includes(type)) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El tipo de poliza no es valido',
			offender: 'type'
		});
	}

	//? 3. Procedemos con la busqueda por tipo
	try {
		const connection = await getConnection();
		const [rows] = await connection.execute('CALL MiSeguroDigital.buscarPolizaPorTipo(?)', [type]);
		await connection.end();

		//? 4. Transformamos los resultados en formato JSON estructurado
		let arrayOfPolizas = Array.isArray(rows) ? rows.map((row: any) => ({
			id: row.id_poliza,
			nombre: row.nombre_de_la_poliza,
			descripcion: row.descripcion_de_la_poliza,
			tipo: row.tipo_de_poliza,
			pagoMensual: row.pago_mensual,
			montoCobertura: row.monto_cobertura_total,
			duracionContrato: row.duracion_de_contrato,
			porcentajeAprobacion: row.porcentaje_de_aprobacion,
			importePorCancelacion: row.importe_por_cancelacion,
			nombreAseguradora: row.nombre_aseguradora,
			estadoPoliza: row.estado_de_poliza
		})) : [];

		if (arrayOfPolizas.length > 0) {
			res.status(200).json({
				success: true,
				message: 'Polizas encontradas por tipo',
				data: arrayOfPolizas,
				offender: ''
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontraron polizas del tipo especificado',
				offender: 'type'
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
 * @description Buscar polizas por compania aseguradora.
 * @param {object} query - Parametros de consulta.
 * @param {string} query.company - Nombre de la compania de seguros a buscar (string).
 * @returns Retorna: polizas que pertenecen a la compania especificada.
 */

//LISTO!!

router.get('/catalogo/buscar-por-aseguradora', async (req: Request, res: Response) => {
	const { company } = req.query;

	//? 1. Validamos que la compania este presente y sea un string valido
	if (!company || typeof company !== 'string') {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El nombre de la compania es requerido y debe ser un string',
			offender: 'company'
		});
	}

	//? 2. Procedemos con la busqueda por aseguradora
	try {
		const connection = await getConnection();
		const [rows] = await connection.execute('CALL MiSeguroDigital.buscarPolizaPorAseguradora(?)', [company]);
		await connection.end();

		//? 3. Transformamos los resultados en formato JSON estructurado
		let arrayOfPolizas = Array.isArray(rows) ? rows.map((row: any) => ({
			id: row.id_poliza,
			nombre: row.nombre_de_la_poliza,
			descripcion: row.descripcion_de_la_poliza,
			tipo: row.tipo_de_poliza,
			pagoMensual: row.pago_mensual,
			montoCobertura: row.monto_cobertura_total,
			duracionContrato: row.duracion_de_contrato,
			porcentajeAprobacion: row.porcentaje_de_aprobacion,
			importePorCancelacion: row.importe_por_cancelacion,
			nombreAseguradora: row.nombre_aseguradora,
			estadoPoliza: row.estado_de_poliza
		})) : [];

		if (arrayOfPolizas.length > 0) {
			res.status(200).json({
				success: true,
				message: 'Polizas encontradas por aseguradora',
				data: arrayOfPolizas,
				offender: ''
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontraron polizas para la aseguradora especificada',
				offender: 'company'
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
 * @description Buscar polizas por nombre parcial.
 * @param {object} query - Parametros de consulta.
 * @param {string} query.name - Nombre parcial de la poliza a buscar (string).
 * @returns Retorna: polizas que coinciden con el nombre parcial especificado.
 */

//LISTO!!

router.get('/catalogo/buscar-por-nombre', async (req: Request, res: Response) => {
	const { name } = req.query;

	//? 1. Validamos que el nombre este presente y sea un string valido
	if (!name || typeof name !== 'string') {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El nombre de la poliza es requerido y debe ser un string',
			offender: 'name'
		});
	}

	//? 2. Procedemos con la busqueda por nombre parcial
	try {
		const connection = await getConnection();
		const [rows] = await connection.execute('CALL MiSeguroDigital.buscarPolizaPorNombreParcial(?)', [name]);
		await connection.end();

		//? 3. Transformamos los resultados en formato JSON estructurado
		let arrayOfPolizas = Array.isArray(rows) ? rows.map((row: any) => ({
			id: row.id_poliza,
			nombre: row.nombre_de_la_poliza,
			descripcion: row.descripcion_de_la_poliza,
			tipo: row.tipo_de_poliza,
			pagoMensual: row.pago_mensual,
			montoCobertura: row.monto_cobertura_total,
			duracionContrato: row.duracion_de_contrato,
			porcentajeAprobacion: row.porcentaje_de_aprobacion,
			importePorCancelacion: row.importe_por_cancelacion,
			nombreAseguradora: row.nombre_aseguradora,
			estadoPoliza: row.estado_de_poliza
		})) : [];

		if (arrayOfPolizas.length > 0) {
			res.status(200).json({
				success: true,
				message: 'Polizas encontradas por nombre',
				data: arrayOfPolizas,
				offender: ''
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontraron polizas con el nombre especificado',
				offender: 'name'
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
 * @description Crear nueva poliza.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.aseguradoraId - ID de la aseguradora (numero).
 * @param {string} body.nombrePoliza - Nombre de la poliza (string).
 * @param {string} body.descripcion - Descripcion de la poliza (string).
 * @param {string} body.tipoPoliza - Tipo de poliza (string) valor perteneciente al enum
 * [enum('seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud')].
 * @param {number} body.pagoMensual - Pago mensual de la poliza (numero).
 * @param {number} body.montoCobertura - Monto de cobertura de la poliza (numero).
 * @param {number} body.duracionContrato - Duracion del contrato en meses (numero).
 * @param {number} body.porcentajeAprobacion - Porcentaje de aprobacion (numero).
 * @param {number} body.importeCancelacion - Importe de cancelacion (numero).
 * @param {string} body.estadoInicial - Estado inicial de la poliza (string), valor perteneciente al enum
 * [enum('activa', 'pausada', 'despublicada')].
 * @param {number} body.brokerId - ID del broker que crea la poliza (numero).
 * @returns Retorna: ID de la poliza creada o error.
 */
router.post('/admin/crear-poliza', async (req: Request, res: Response) => {
  const {
      aseguradoraId, nombrePoliza,
      descripcion, tipoPoliza,
      pagoMensual, montoCobertura,
      duracionContrato, porcentajeAprobacion,
      importeCancelacion, estadoInicial,
      brokerId } = req.body;

	//? 1.1 Validamos que todos los puntos de datos esten presentes, sino se registra el primer offender
	if (!aseguradoraId || !nombrePoliza || !descripcion || !tipoPoliza || !pagoMensual
		|| !montoCobertura || !duracionContrato || !porcentajeAprobacion || !importeCancelacion
		|| !estadoInicial || !brokerId) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Los datos de entrada son incompletos',
			offender: (!aseguradoraId) ? 'aseguradoraId' : (!nombrePoliza) ? 'nombrePoliza' : (!descripcion) ? 'descripcion' : (!tipoPoliza) ? 'tipoPoliza' :
				(!pagoMensual) ? 'pagoMensual' : (!montoCobertura) ?
					'montoCobertura' : (!duracionContrato) ? 'duracionContrato' :
						(!porcentajeAprobacion) ? 'porcentajeAprobacion' :
							(!importeCancelacion) ? 'importeCancelacion' :
								(!estadoInicial) ? 'estadoInicial' : 'brokerId'
		});
	}


  // 1.2 Validacin de que los enums tengan data y sean correctos
  if (!['seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud'].includes(tipoPoliza)) {
    return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised ] El tipo de poliza no es valido',
			offender: 'tipoPoliza'
		});
  }
  if (!['activa', 'pausada', 'despublicada'].includes(estadoInicial)) {
      return res.status(400).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] El estado inicial no es valido',
				offender: 'estadoInicial'
			});
  }

	//? 2. Proceder con la creacion de la poliza
  try {
    const connection = await getConnection();
    await connection.execute(
      'CALL MiSeguroDigital.crearPolizaPorBrokerAdmin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @codigoResultado, @nuevaPolizaId)',
      [aseguradoraId, nombrePoliza, descripcion, tipoPoliza, pagoMensual,
          montoCobertura, duracionContrato, porcentajeAprobacion, importeCancelacion,
          estadoInicial, brokerId]
    );
    
    const [result] =
        await connection.execute('SELECT @codigoResultado as codigo, @nuevaPolizaId as polizaId');
    await connection.end();
    
    const { codigo, polizaId } = Array.isArray(result) && result[0] ? result[0] as any :
			{ codigo: 500, polizaId: null };
    
    if (codigo === 200) {
      res.json({
				success: true,
				id_poliza: polizaId,
				message: 'Poliza creada correctamente',
				offender: ''
			});
    } else if (codigo == 404) {
      res.status(codigo).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Aseguradora no encontrada',
				offender: 'aseguradoraId'
			});
    } else {
      res.status(codigo).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] API Error al crear poliza',
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
 * @description Actualizar poliza existente.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza a actualizar (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.nombrePoliza - Nuevo nombre de la poliza (string).
 * @param {string} body.descripcion - Nueva descripcion de la poliza (string).
 * @param {string} body.tipoPoliza - Nuevo tipo de poliza (string) valor perteneciente al enum
 * [enum('seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud')].
 * @param {number} body.pagoMensual - Nuevo pago mensual (numero).
 * @param {number} body.montoCobertura - Nuevo monto de cobertura (numero).
 * @param {number} body.duracionContrato - Nueva duracion del contrato (numero).
 * @param {number} body.porcentajeAprobacion - Nuevo porcentaje de aprobacion (numero).
 * @param {number} body.importeCancelacion - Nuevo importe de cancelacion (numero).
 * @param {string} body.estadoPoliza - Nuevo estado de la poliza (string) valor perteneciente al enum
 * [enum('activa', 'pausada', 'despublicada')].
 * @param {number} body.brokerId - ID del broker que actualiza la poliza (numero).
 * @returns Retorna: confirmacion de actualizacion o error.
 */
router.put('/admin/actualizar-poliza/:policyId', async (req: Request, res: Response) => {
  const { policyId } = req.params;
  const { nombrePoliza, descripcion, tipoPoliza,
      pagoMensual, montoCobertura, duracionContrato,
      porcentajeAprobacion, importeCancelacion, estadoPoliza, brokerId } = req.body;

	//? 1.1 Validamos que todos los puntos de datos esten presentes, sino regresamos 400 con el primer offender
	if (!nombrePoliza || !descripcion || !tipoPoliza || !pagoMensual
		|| !montoCobertura || !duracionContrato || !porcentajeAprobacion ||
		!importeCancelacion || !estadoPoliza || !brokerId) {
			res.status(400).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Los datos de entrada son incompletos',
				offender: (!nombrePoliza) ? 'nombrePoliza' : (!descripcion) ? 'descripcion' : (!tipoPoliza) ? 'tipoPoliza' :
					(!pagoMensual) ? 'pagoMensual' : (!montoCobertura) ?
						'montoCobertura' : (!duracionContrato) ? 'duracionContrato' :
							(!porcentajeAprobacion) ? 'porcentajeAprobacion' :
								(!importeCancelacion) ? 'importeCancelacion' :
									(!estadoPoliza) ? 'estadoPoliza' : 'brokerId'
			});
	}

	//? 1.2 Validamos que el tipo de poliza este en el enum correcto
	if (!['seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud'].includes(tipoPoliza)) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El tipo de poliza no es valido',
			offender: 'tipoPoliza'
		});
	}

	//? 1.3 Validamos que el estado de la poliza sea el correcto
	if (!['activa', 'pausada', 'despublicada'].includes(estadoPoliza)) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El estado de la poliza no es valido',
			offender: 'estadoPoliza'
		});
	}

	//? 2. Proceder con la actualizacion de la poliza

	try {
		const connection = await getConnection();
		await connection.execute(
			'CALL MiSeguroDigital.actualizarPolizaPorAdmin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @codigoResultado)',
			[policyId, nombrePoliza, descripcion,
				tipoPoliza, pagoMensual, montoCobertura,
				duracionContrato, porcentajeAprobacion, importeCancelacion,
				estadoPoliza, brokerId]
		);

		const [result] = await connection.execute('SELECT @codigoResultado as codigo');
		await connection.end();

		const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;

		if (codigo === 200) {
			res.status(200).json({
				success: true,
				message: 'Poliza actualizada correctamente',
				offender: ''
			});
		} else if (codigo === 404) {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Poliza no encontrada',
				offender: 'policyId'
			});
		} else {
			res.status(codigo).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Error al actualizar poliza',
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
 * @description Eliminar poliza existente. Esta ruta esta disenada para ser manejada por administradores
 * de tipo broker_admin o broker_superadmin dado que permite eliminar polizas del sistema.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza a eliminar (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.brokerId - ID del broker administrador que elimina la poliza (numero).
 * @returns Retorna: confirmacion de eliminacion o error.
 */
router.delete('/admin/eliminar-poliza/:policyId', async (req: Request, res: Response) => {
	const { policyId } = req.params;
	const { brokerId } = req.body;

	//? 1. Validamos que el ID de la poliza sea valido y no sea negativo
	if (!policyId || Number.parseInt(policyId) <= 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El ID de la poliza es requerido y debe ser mayor que cero',
			offender: 'policyId'
		});
	}

	//? 2. Validamos que el ID del broker este presente y sea valido
	if (!brokerId || brokerId <= 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El ID del broker es requerido y debe ser mayor que cero',
			offender: 'brokerId'
		});
	}

	//? 3. Procedemos con la eliminacion de la poliza
	try {
		const connection = await getConnection();
		await connection.execute(
			'CALL MiSeguroDigital.eliminarPolizaPorAdminBroker(?, ?, @codigoResultado)',
			[policyId, brokerId]
		);

		const [result] = await connection.execute('SELECT @codigoResultado as codigo');
		await connection.end();

		const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;

		//? 4. Evaluamos el resultado y retornamos la respuesta apropiada
		if (codigo === 200) {
			res.status(200).json({
				success: true,
				message: 'Poliza eliminada correctamente',
				offender: ''
			});
		} else if (codigo === 404) {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Poliza no encontrada',
				offender: 'policyId'
			});
		} else if (codigo === 409) {
			res.status(409).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No tiene permisos para eliminar esta poliza, todavia hay registros asociados' +
					'con esta poliza.',
				offender: 'policyId'
			});
		} else {
			res.status(codigo).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Error al eliminar poliza',
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
 * @description Obtener datos de polizas para analistas (solo lectura).
 * @note Sin parametros.
 * @returns Retorna: vista de solo lectura de polizas para analisis.
 */

//LISTO!!

router.get('/analyst/dashboard', async (req: Request, res: Response) => {
  try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
				'SELECT * FROM MiSeguroDigital.viewPolizasBrokerAnalista');
      await connection.end();

      //? De nuevo, como el retorno es una tabla y no un jsond esde la base de datos (se podria hacer como en el login)
      //? tenemos que escribir nuestro propio json
      const arrayOfPolizas = Array.isArray(rows) ? rows.map((row: any) => ({
          id: row.id_poliza,
          nombre: row.nombre_de_la_poliza,
          descripcion: row.descripcion_de_la_poliza,
          tipo: row.tipo_de_poliza,
          pagoMensual: row.pago_mensual,
          montoCobertura: row.monto_cobertura_total,
          duracionContrato: row.duracion_de_contrato,
          estadoPoliza: row.estado_de_poliza,
          nombreAseguradora: row.nombre_aseguradora,
          totalAplicaciones: row.total_aplicaciones,
          totalPendientes: row.aplicaciones_pendientes,
          totalAprobadas: row.aplicaciones_aprobadas,
          totalRechazadas: row.aplicaciones_rechazadas
          })) : [];
      if (arrayOfPolizas.length > 0) {
          res.json(arrayOfPolizas);
      } else {
          res.status(404).json({ message: 'No se encontraron polizas en el catalogo' });
      }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @description Obtener dashboard completo para administradores broker. Este endpoint proporciona
 * una vista consolidada de todas las metricas y estadisticas necesarias para la gestion administrativa
 * de polizas, incluyendo resumen general, polizas detalladas y metricas por aseguradora.
 * @note Sin parametros de entrada requeridos.
 * @returns Retorna: objeto JSON con dashboard completo incluyendo resumen general, polizas detalladas,
 * agrupacion por aseguradora y metricas consolidadas para administradores broker.
 */

//LISTO!!

router.get('/admin/polizas-dashboard', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    // 1) Vista REAL existente
    const [basicRows] = await connection.execute(
      'SELECT * FROM MiSeguroDigital.viewInformacionPolizaBasica'
    );

    // 2) Vista REAL que sustituye a viewPolizaInfoPorAseguradora
    const [byCompanyRows] = await connection.execute(
      'SELECT * FROM MiSeguroDigital.viewEstadisticasDeSolicitudesReporteParaBrokers'
    );

    await connection.end();

    if (!Array.isArray(basicRows) || !Array.isArray(byCompanyRows)) {
      return res.status(500).json({
        success: false,
        message: 'Error en estructura de datos DB',
        offender: 'database_structure',
      });
    }

    // ---------- Transformación de información básica ----------
    const basicPolicies = basicRows.map((row: any) => ({
      id_poliza: row.id_poliza,
      nombre_poliza: row.nombre_de_la_poliza,
      descripcion: row.descripcion_de_la_poliza,
      tipo_poliza: row.tipo_de_poliza,
      pago_mensual: row.pago_mensual,
      monto_cobertura_total: row.monto_cobertura_total,
      duracion_contrato: row.duracion_de_contrato,
      porcentaje_aprobacion: row.porcentaje_de_aprobacion,
      importe_cancelacion: row.importe_por_cancelacion,
      estado_poliza: row.estado_de_poliza,
      aseguradora: {
        id_aseguradora: row.id_aseguradora,
        nombre_aseguradora: row.nombre_aseguradora,
        dominio_correo: row.dominio_correo_aseguradora || '',
      },
      estadisticas_aplicaciones: {
        total_aplicaciones: Number(row.total_aplicaciones),
        aplicaciones_pendientes: Number(row.aplicaciones_pendientes),
        aplicaciones_aprobadas: Number(row.aplicaciones_aprobadas),
      },
    }));

    const policiesByCompany = byCompanyRows.map((row: any) => ({
      aseguradora: {
        id_aseguradora: row.id_aseguradora,
        nombre_aseguradora: row.nombre_aseguradora,
      },
      poliza: {
        id_poliza: row.id_poliza,
        nombre_poliza: row.nombre_de_la_poliza,
        estado_poliza: row.estado_de_poliza,
      },
      metricas: {
        total_aplicaciones: row.total_aplicaciones,
      },
    }));

    // ---------- Resumen general ----------
    const resumenGeneral = {
      total_polizas: basicPolicies.length,
      polizas_activas: basicPolicies.filter((p) => p.estado_poliza === 'activa').length,
      polizas_pausadas: basicPolicies.filter((p) => p.estado_poliza === 'pausada').length,
      polizas_despublicadas: basicPolicies.filter((p) => p.estado_poliza === 'despublicada').length,
      total_aplicaciones_pendientes: basicPolicies.reduce(
        (sum, p) => sum + (p.estadisticas_aplicaciones.aplicaciones_pendientes || 0),
        0
      ),
      total_aplicaciones_aprobadas: basicPolicies.reduce(
        (sum, p) => sum + (p.estadisticas_aplicaciones.aplicaciones_aprobadas || 0),
        0
      ),
    };

    // ---------- Estructura final ----------
    res.status(200).json({
      success: true,
      message: 'Dashboard de administrador generado correctamente',
      data: {
        resumen_general: resumenGeneral,
        polizas_detalladas: basicPolicies,
        metricas_por_aseguradora: groupByInsuranceCompany(policiesByCompany),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno al generar dashboard',
      offender: error,
    });
  }
});


/**
 * @description Funcion auxiliar para agrupar metricas por aseguradora. Esta funcion procesa
 * el array de polizas por compania y genera estadisticas consolidadas por cada aseguradora,
 * incluyendo totales de polizas, aplicaciones, registros activos y polizas de alta popularidad.
 * @param {Array} policiesByCompany - Array de polizas agrupadas por aseguradora.
 * @returns Retorna: array de objetos con metricas consolidadas por aseguradora.
 */
function groupByInsuranceCompany(policiesByCompany: any[]): any[] {
	//? 1. Validamos que el parametro de entrada sea un array valido
	if (!Array.isArray(policiesByCompany) || policiesByCompany.length === 0) {
		return [];
	}

	//? 2. Procesamos agrupacion usando reduce para consolidar metricas por aseguradora
	const grouped = policiesByCompany.reduce((acc, item) => {
		//? 2.1 Validamos que el item tenga la estructura esperada
		if (!item || !item.aseguradora || !item.aseguradora.nombre_aseguradora) {
			return acc; // Saltamos items invalidos
		}

		const companyName = item.aseguradora.nombre_aseguradora;

		//? 2.2 Inicializamos el acumulador para la aseguradora si no existe
		if (!acc[companyName]) {
			acc[companyName] = {
				id_aseguradora: item.aseguradora.id_aseguradora || 0,
				nombre_aseguradora: companyName,
				total_polizas: 0,
				total_aplicaciones: 0,
				total_registros_activos: 0,
				polizas_alta_popularidad: 0
			};
		}

		//? 2.3 Acumulamos las metricas con validaciones de nulidad
		acc[companyName].total_polizas += 1;
		acc[companyName].total_aplicaciones += (item.metricas?.total_aplicaciones || 0);
		acc[companyName].total_registros_activos += (item.metricas?.registros_activos || 0);

		if (item.metricas?.popularidad_poliza === 'Alta') {
			acc[companyName].polizas_alta_popularidad += 1;
		}

		return acc;
	}, {} as Record<string, any>);

	//? 3. Convertimos el objeto agrupado en array y retornamos los valores
	return Object.values(grouped);
}





/**
 * @description Obtener todos los requisitos de una poliza.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza (numero).
 * @returns Retorna: lista de requisitos de la poliza especificada.
 */

//LISTO!!

router.get('/usuarios/requerimientos-de-poliza/:policyId', async (req: Request, res: Response) => {
  const { policyId } = req.params;

	//? 1.1 Validamos que el ingreso de datos no tenga valores nulos ni menores que cero
	if (!policyId || Number.parseInt(policyId) <= 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] ID de poliza no valido',
			offender: 'policyId'
		});
	}

  try {
    const connection = await getConnection();

		const [result] =
			await connection.execute('select * from viewRequesitosPorPolizas where id_poliza = ?',
			[policyId]);
    await connection.end();

		//? 2.1. Transformamos los resultados en formato JSON estructurado con validaciones
		let arrayDeRequisitos = Array.isArray(result)
			? result.map((requisito: any) => (
			{
				id_poliza: requisito.id_poliza,
				nombre_de_la_poliza: requisito.nombre_de_la_poliza,
				id_requerimiento: requisito.id_requerimiento,
				tipo_requerimiento: requisito.tipo_requerimiento,
				descripcion_requerimiento: requisito.descripcion_requerimiento,
				requerimiento_obligatorio: requisito.requerimiento_obligatorio
			})) : [];

		//? 2.2. Evaluamos si se encontraron requisitos y retornamos respuesta apropiada
		if (arrayDeRequisitos.length > 0) {
			res.status(200).json({
				success: true,
				message: 'Requisitos de poliza encontrados correctamente',
				data: arrayDeRequisitos,
				offender: ''
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontraron requisitos para la poliza especificada',
				offender: 'policyId'
			});
		}

	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor al obtener requisitos',
			offender: error
		});
	}
});

/**
 * @description Agregar nuevo requisito a una poliza.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.tipoRequerimiento - Tipo de requerimiento (string)
 * [enum('registros_medicos', 'estados_de_cuenta', 'historial_crediticio', 'prueba_de_residencia', 'otro'),].
 * @param {string} body.descripcionRequerimiento - Descripcion del requerimiento (string).
 * @param {boolean} body.requerimientoObligatorio - Si el requerimiento es obligatorio (boolean).
 * @param {number} body.brokerId - ID del broker que agrega el requisito (numero).
 * @returns Retorna: confirmacion de creacion del requisito o error.
 */
router.post('/admin/anadir-requerimientos-de-poliza/:policyId', async (req: Request, res: Response) => {
  const { policyId } = req.params;
  const { tipoRequerimiento, descripcionRequerimiento, requerimientoObligatorio,  } = req.body;

	//? 1.1 Validamos que todas las entradas de datos se hayan realizado
	if (!policyId || !tipoRequerimiento || !descripcionRequerimiento
		|| !requerimientoObligatorio) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Faltan datos de entrada para agregar requisito',
			offender: (!policyId) ? 'policyId' : (!tipoRequerimiento) ? 'tipoRequerimiento' : (!descripcionRequerimiento)
				? 'descripcionRequerimiento' : (!requerimientoObligatorio) ? 'requerimientoObligatorio' : 'brokerId'
		});
	}

	//? 1.2 validamos que los ids sean mayores que cero
	if (Number.parseInt(policyId) <= 0 ) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] ID de poliza o broker no valido',
			offender: (!policyId) ? 'policyId' : 'brokerId'
		});
	}

	//? 1.3 Validamos que el tipo de registro este en el enum adecuado
	if (!['registros_medicos', 'estados_de_cuenta', 'historial_crediticio', 'prueba_de_residencia', 'otro'].includes(tipoRequerimiento)) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Tipo de requerimiento no valido',
			offender: 'tipoRequerimiento'
		});
	}

	//? 2. Ejecutamos el codigo general
  try {
    const connection = await getConnection();
    const [result] =
			await connection.execute('call agregarRequsitisoParaPolizas(?,?,?,?,@codigoResultado)',
				[policyId, tipoRequerimiento, descripcionRequerimiento, requerimientoObligatorio])
    await connection.end();

		//? 2.1 Con la respuesta, se devuelve el codigo del resultado y lo parseamos
		const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;

		if (codigo === 200 ){
			res.status(200).json({
				success: true,
				message: 'Requisito agregado correctamente',
				offender: ''
			});
		} else if (codigo === 404) {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontraron requisitos para la poliza especificada',
				offender: 'policyId'
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] API Error al cumplir con la request',
				offender: 'API Error'
			});
		}
  } catch (error) {
    res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor al agregar requisito',
			offender: error
		});
  }
});

/**
 * @description Actualizar requisito existente de una poliza. Este endpoint permite a los administradores
 * broker modificar los detalles de un requisito especifico, incluyendo su tipo, descripcion y
 * si es obligatorio u opcional para la aplicacion a la poliza.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.requirementId - ID del requisito a actualizar (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.tipoRequerimiento - Nuevo tipo de requerimiento (string)
 * [enum('registros_medicos', 'estados_de_cuenta', 'historial_crediticio', 'prueba_de_residencia', 'otro')].
 * @param {string} body.descripcionRequerimiento - Nueva descripcion del requerimiento (string).
 * @param {boolean} body.requerimientoObligatorio - Si el requerimiento es obligatorio (boolean).
 * @returns Retorna: confirmacion de actualizacion del requisito o error.
 */
router.put('/admin/actualizar-requerimiento-poliza/:requirementId', async (req: Request, res: Response) => {
  const {requirementId } = req.params;
  const { tipoRequerimiento, descripcionRequerimiento, requerimientoObligatorio } = req.body;

	//? 1.1 Validamos que todas las entradas de datos se hayan realizado
	if (!requirementId || !tipoRequerimiento ||
			!descripcionRequerimiento || !requerimientoObligatorio) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Faltan datos de entrada para actualizar requisito',
			offender: (!requirementId) ? 'requirementId' : (!tipoRequerimiento) ? 'tipoRequerimiento' : (!descripcionRequerimiento)
				? 'descripcionRequerimiento' : (!requerimientoObligatorio) ? 'requerimientoObligatorio' : 'brokerId'
		});
	}

	//? 1.2 Validamosque los ids no sean negativos
	if (Number.parseInt(requirementId) <= 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] ID de poliza o requisito no valido',
			offender: 'requirementId'
		});
	}

	//? 1.3 Validamos que el tipo de requerimiento este en el enum correspondiente
	if (!['registros_medicos', 'estados_de_cuenta', 'historial_crediticio', 'prueba_de_residencia', 'otro'].includes(tipoRequerimiento)) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Tipo de requerimiento no valido',
			offender: 'tipoRequerimiento'
		});
	}

	//? 2. Ejecutamos el codigo general
  try {
    const connection = await getConnection();
		await connection.execute(
			'CALL MiSeguroDigital.actualizarRequisitosDeUnaPoliza(?, ?, ?, ?, @codigoResultado)',
			[requirementId, tipoRequerimiento, descripcionRequerimiento, requerimientoObligatorio]
		);

		const [result] = await connection.execute('SELECT @codigoResultado as codigo');
		await connection.end();


		//? 2.1 Tomamos el resultado y sacamos el codigo
		const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;

		//? 2.2 Retornamos respuesta segun codigo
		if (codigo === 200) {
			res.status(200).json({
				success: true,
				message: 'Requisito actualizado correctamente',
				offender: ''
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontro una definicion para el requerimiento definido.',
				offender: 'requirementId'
			})
		}
  } catch (error) {
    res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor al actualizar requisito',
			offender: error
		});
  }
});

/**
 * @description Eliminar requisito de una poliza. Este endpoint permite a los administradores
 * broker eliminar un requisito especifico de una poliza. Solo se requiere el ID del requisito
 * ya que cada requisito esta inherentemente vinculado a su poliza correspondiente.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.requirementId - ID del requisito a eliminar (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.brokerId - ID del broker administrador que elimina el requisito (numero).
 * @returns Retorna: confirmacion de eliminacion del requisito o error.
 */
router.delete('/admin/eliminar-requerimiento/:requirementId', async (req: Request, res: Response) => {
	const { requirementId } = req.params;
	const { brokerId } = req.body;

	//? 1. Validamos que el ID del requisito sea valido y no sea nulo o menor que cero
	if (!requirementId || Number.parseInt(requirementId) <= 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] ID de requisito no valido, debe ser un numero mayor que cero',
			offender: 'requirementId'
		});
	}

	//? 1.1 Validamos que el ID del broker este presente y sea valido
	if (!brokerId || brokerId <= 0) {
		return res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] ID del broker es requerido y debe ser mayor que cero',
			offender: 'brokerId'
		});
	}

	//? 2. Procedemos con la eliminacion del requisito de la poliza
	try {
		const connection = await getConnection();

		//? 2.1 Ejecutamos el procedimiento almacenado para eliminar el requisito
		await connection.execute(
			'CALL MiSeguroDigital.eliminarRequisitoPolizaPorAdmin(?, @codigoResultado)',
			[requirementId]
		);

		//? 2.2 Obtenemos el codigo de resultado del procedimiento
		const [result] = await connection.execute('SELECT @codigoResultado as codigo');
		await connection.end();

		//? 2.3 Evaluamos el codigo de resultado y retornamos respuesta apropiada
		const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;

		if (codigo === 200) {
			res.status(200).json({
				success: true,
				message: 'Requisito eliminado correctamente',
				offender: ''
			});
		} else if (codigo === 404) {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontro el requisito especificado',
				offender: 'requirementId'
			});
		} else {
			res.status(codigo).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Error al eliminar requisito',
				offender: 'API Error'
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor al eliminar requisito',
			offender: error
		});
	}
});

export default router;