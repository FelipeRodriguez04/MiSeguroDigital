import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();


/**
 * @description Crear nuevo comentario/review de poliza. Este endpoint se permite para los usuarios only, dado que
 * el rol del usuario es comentar y compartir sus esxperiencies con una poliza. En este caso el sistema valida internamente
 * que exista un registro entre la polia y el usuario para permitir el comentario, si no exsite entonces
 * no deja pasar la request y retornamos un error code
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.usuarioId - ID del usuario que comenta (numero).
 * @param {number} body.polizaId - ID de la poliza que se comenta (numero).
 * @param {number} body.rating - Calificacion de la poliza (numero).
 * @param {string} body.contexto - Texto del comentario (string).
 * @param {boolean} body.tieneHiddenFees - Indicador de tarifas ocultas (boolean).
 * @param {string} [body.detalleHiddenFees] - Detalle de las tarifas ocultas (string opcional).
 * @returns Retorna: ID del review creado o error.
 */
router.post('/usuarios/crear-comentario-en-poliza', async (req: Request, res: Response) => {
	const {
		usuarioId, polizaId, rating,
		contexto, tieneHiddenFees, detalleHiddenFees } = req.body;

	//? 1.1 Validamos que todos los datos existan y si no retornamos 400 con el primer offender
	if (!usuarioId || !polizaId || !rating || !contexto || tieneHiddenFees === undefined || tieneHiddenFees === null) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] No se han registrado alguno de los campos para este endpoint',
			offender: (!usuarioId) ? 'usuarioId' : (!polizaId) ? 'polizaId' : (!rating) ? 'rating' : (!contexto) ? 'contexto' : 'tieneHiddenFees'
		});
		return;
	}
	//? 1.1.1 Si tieneHiddenFees es true, detalleHiddenFees es requerido, si no retornamos 400 con el offender
	if (tieneHiddenFees && (!detalleHiddenFees || detalleHiddenFees.trim() === '')) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Si tieneHiddenFees es true, detalleHiddenFees es requerido',
			offender: 'detalleHiddenFees'
		});
		return;
	}

	//? 1.2 Validamos que los ids de usuario y poliza no sean negativos, si es asi retornamos 400 con el offender
	if (usuarioId < 0 || polizaId < 0) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Los ids de usuario y poliza no deben ser negativos',
			offender: (usuarioId < 0) ? 'usuarioId' : 'polizaId'
		});
	}


	//? 2. Procedemos con la query normal
	try {
		const connection = await getConnection();
		await connection.execute(
			'CALL MiSeguroDigital.crearComentarioPolizaPorUsuario(?, ?, ?, ?, ?, ?, @codigoResultado, @nuevoReviewId)',
			[usuarioId, polizaId, rating, contexto, tieneHiddenFees, detalleHiddenFees]
		);

		const [resultadoCreacionComentario] =
			await connection.execute(
				'SELECT @codigoResultado as codigo, @nuevoReviewId as reviewId');

		await connection.end();

		const { codigo, reviewId } =
			Array.isArray(resultadoCreacionComentario) && resultadoCreacionComentario[0]
				? resultadoCreacionComentario[0] as any : { codigo: 500, reviewId: null };

		//? 2.1 Si la creacion fue exitosa retornamos el id del review creado
		if (codigo === 200) {
			res.status(200).json({
				success: true,
				createdReviewId: reviewId,
				message: 'Comentario creado correctamente',
				offender: ''
			});
		} else if (codigo === 403){
			res.status(403).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se puede comentar esta poliza, el usuario no esta registrado en ella',
				offender: ['usuarioId', 'polizaId']
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] API Error a la hora de registrar el comentario',
				offender: 'API Error'
			})
		}
	} catch (error: Error | any) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		});
	}
});


/**
 * @description Actualizar comentario/review de poliza. Este endpoint se permite para los usuarios only, dado que
 * el rol del usuario es comentar y compartir sus esxperiencies con una poliza. En este caso el sistema valida internamente
 * que exista un registro entre la polia y el usuario para permitir la actualizacion, si no exsite entonces
 * no deja pasar la request y retornamos un error code
 * @param {object} params - Parametros de la URL.
 * @param {number} params.reviewId - ID del review que se actualiza (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.usuarioId - ID del usuario que comenta (numero).
 * @param {number} body.rating - Calificacion de la poliza (numero).
 * @param {string} body.contexto - Texto del comentario (string).
 * @param {boolean} body.tieneHiddenFees - Indicador de tarifas ocultas (boolean).
 * @param {string} [body.detalleHiddenFees] - Detalle de las tarifas ocultas (string opcional).
 * @returns Retorna: ID del review creado o error.
 */
router.put('/usuarios/actualizar-comentario-en-poliza/:reviewId', async (req: Request, res: Response) => {
	const { reviewId } = req.params;
	const { usuarioId, rating, contexto, tieneHiddenFees, detalleHiddenFees } = req.body;

	//? 1.1 Revisamos que toda la data este registrada, retornamos 400 y el primer offender si no
	if (!reviewId || !usuarioId || !rating || !contexto || tieneHiddenFees === undefined || tieneHiddenFees === null) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] No se han registrado alguno de los campos para este endpoint',
			offender: (!reviewId) ? 'reviewId' : (!usuarioId) ? 'usuarioId' : (!rating) ? 'rating' : (!contexto) ? 'contexto' : 'tieneHiddenFees'
		});
	}

	//? 1.2 Validamos que si tenemos el detalle de tieneHiddenFees entonces tenga un valor, si no retornamos 400 con el offender
	if (tieneHiddenFees && (!detalleHiddenFees || detalleHiddenFees.trim() === '')) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Si tieneHiddenFees es true, detalleHiddenFees es requerido',
			offender: 'detalleHiddenFees'
		});
	}

	//? 1.3 Validamos que los ids proporcionados sean mayores que cero
	// @ts-ignore
	if (usuarioId < 0 || Number.parseInt(reviewId) < 0) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Los ids de usuario y reviewId no deben ser negativos',
			offender: (usuarioId < 0) ? 'usuarioId' : 'reviewId'
		});
	}

	//? 2. Procedemos con la query normal
	try {
		const connection = await getConnection();
		await connection.execute(
			'CALL MiSeguroDigital.editarComentarioPorUsuario(?, ?, ?, ?, ?, ?, @codigoResultado)',
			[reviewId, usuarioId, rating, contexto, tieneHiddenFees, detalleHiddenFees]
		);

		const [resultadoActualizacion] = await connection.execute('SELECT @codigoResultado as codigo');
		await connection.end();

		const codigo = Array.isArray(resultadoActualizacion) && resultadoActualizacion[0]
			? (resultadoActualizacion[0] as any).codigo : 500;

		//? 2.1 Nos basamos en el codigo de la query para retornar el mensaje correcto
		if (codigo === 200) {
			res.status(200).json({
				success: true,
				message: 'Comentario actualizado correctamente',
				offender: ''
			});
		} else if (codigo === 403) {
			res.status(403).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se puede editar este comentario, el usuario enviado a la API no es el dueno del ' +
					'comentario',
				offender: 'usuarioId'
			});
		} else if (codigo == 404){
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontro el comentario con el id proporcionado',
				offender: 'reviewId'
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] API Error a la hora de actualizar el comentario',
				offender: 'API Error'
			})
		}
	} catch (error: Error | any) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		});
	}
});

/**
 * @description Eliminar comentario/review de poliza. Este endpoint esta habilitado para los administradores
 * dado que se considera que los administradores pueden eliminar cualquier comentario de una poliza, no los usuarios.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.reviewId - ID del review que se elimina (numero).
 * @returns Retorna: ID del review eliminado o error.
 */
router.delete('/admin/eliminar-comentario-en-poliza/:reviewId', async (req: Request, res: Response) => {
	const {reviewId} = req.params;

	//? 1.1 Validamos que el valor ingresado no sea nulo y que sea mayor que cero
	if (!reviewId || Number.parseInt(reviewId) < 0) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El id del review a eliminar no puede ser nulo o negativo',
			offender: 'reviewId'
		});
	}

	//? 2. Procedemos con la query normal
	try {
		const connection = await getConnection();
		await connection.execute(
			'CALL MiSeguroDigital.eliminarComentarioPorAdmin(?, @codigoResultado)', [reviewId]);
		const [resultadoEliminacion] = await connection.execute('SELECT @codigoResultado as codigo');
		await connection.end();

		//? 2.1 Basados en la respuesta retornamos la info al frontend
		const codigo = Array.isArray(resultadoEliminacion) && resultadoEliminacion[0]
			? (resultadoEliminacion[0] as any).codigo : 500;

		if (codigo === 200) {
			res.status(200).json({
				success: true,
				message: 'Comentario eliminado correctamente',
				offender: ''
			});
		} else if (codigo === 404){
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontro el comentario con el id proporcionado',
				offender: 'reviewId'
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] API Error a la hora de eliminar el comentario',
				offender: 'API Error'
			})
		}
	} catch (error: Error | any) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor',
			offender: error
		});
	}
});

/**
 * @description Obtener comentarios de una poliza especifica. Este endpoint permite al frontend
 * jalar todos los datos de la base de datos con respecto a los comentarios de una poliza
 * para luego estructurarlos en el frontend
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza (numero).
 * @returns Retorna: lista de comentarios y reviews de la poliza.
 */

//LISTO!!

router.get('/obtener-comentarios-poliza/:policyId', async (req: Request, res: Response) => {
  const { policyId } = req.params;

	//? 1.1 Vaalidamos que la policy id no sea nula y que sea mayor que cero
	if (!policyId || Number.parseInt(policyId) < 0) {
		res.status(400).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] El id de la poliza no puede ser nulo o negativo',
			offender: 'policyId'
		});
	}

	//? 2. Procedemos con la query normal
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('CALL MiSeguroDigital.obtenerComentariosPorIDPoliza(?)', [policyId]);
    await connection.end();

	const resultRows = Array.isArray(rows) ? rows[0] : [];

	let arrayOfPolicyReviews = Array.isArray(resultRows)
	? resultRows.map((row: any) => ({
		id_review: row.id_review,
		rating_del_usuario: row.rating_del_usuario,
		contexto_review: row.contexto_review,
		tiene_hidden_fees: row.tiene_hidden_fees,
		detalle_hidden_fees: row.detalle_hidden_fees,
		fecha_creacion_review: row.fecha_creacion_review,
		full_nombre_usuario: row.full_nombre_usuario
		}))
	: [];


		if (arrayOfPolicyReviews.length === 0) {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontraron comentarios para esta poliza',
				offender: ''
			});
		} else {
			res.status(200).json({
				success: true,
				reviews: arrayOfPolicyReviews,
				message: 'Comentarios obtenidos correctamente',
				offender: ''
			});
		}
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



export default router;