import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Obtener historial de pagos de un usuario. Esta ruta esta permitida tanto para los administradores como
 * para los usuarios, en donde se puede obtener desde un store procedure la data del historial de pagos
 * y exponerlo al front end. Considero que esta ruta puede ser utilizada para sacar reportes tambien y sacar PDFs de los
 * pagos.
 * @note {Usage} - Para usar esta ruta, sugier usarla dentro de un analisis interno de registros en polizas por usuario, dado
 * que requiere del RegistryID que no es lo mismo que el userID dado que los pagos no viven solos en el sistema, sino que
 * viven asociados a un registro de poliza.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.registryId - ID del registro de poliza del usuario (numero).
 * @returns Retorna: historial completo de pagos del usuario.
 */

//LISTO!!

router.get('/usuario/historial-de-pagos/:registryId', async (req: Request, res: Response) => {
  const { registryId } = req.params;

	//? 1. Validamos que el parametro sea un numero y no sea menor que cero
	if (!registryId || Number.parseInt(registryId) <= 0) {
		return res.status(400).json(
			{
				success: false,
				message: 'Error code 0x001 - [Raised] El parametro de la URL no es un numero valido'
				+ ' para este endpoint',
				offender: 'registryId'
			}
		);
	}

	//? 2. Continuamos con el proceso
  try {
    const connection = await getConnection();
    const [rows] =
			await connection.execute(
				'CALL MiSeguroDigital.obtenerPagosRealizadosPorUsuario(?)', [registryId]);
    await connection.end();
				
	const rowsData = Array.isArray(rows) && rows.length > 0 ? rows[0] : [];
    //? 2.1 Si tenemos informacion en la respuesta lo transforammos en un arreglo y lo retornamos, si no retornamos un error
		let arrayOfPayments = Array.isArray(rowsData) ? rowsData.map((payment: any) => ({
			id_pago: payment.id_pago,
			cantidad_pago: payment.cantidad_pago,
			fecha_de_pago: payment.fecha_de_pago,
			estado_del_pago: payment.estado_del_pago,
			metodo_de_pago: payment.metodo_de_pago,
			motivo_del_pago: payment.motivo_del_pago
		})) : [];

		if (arrayOfPayments.length > 0) {
			res.status(200).json({
				success: true,
				message: 'Historial de pagos obtenido correctamente',
				data: arrayOfPayments,
				offender: ''
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001- [Raised] No se encontraron pagos para la poliza definida',
				offender: 'registryId',
				data: []
			});
		}
  } catch (error) {
		 res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor al obtener historial de pagos',
			offender: error
		});
  }
});

/**
 * @description Registrar nuevo pago de poliza. En este caso solo necesitamos el registroPolizaId porque internamente
 * este registro de poliza tiene una relacion entre cliente y aplicacion, por lo que para que este regitro exista
 * el sistema tiene que ya conocer al usuario y la aplicacion tuvo que ser aceptada.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.registroPolizaId - ID del registro de la poliza (numero).
 * @param {number} body.cantidadPago - Monto del pago (decimal).
 * @param {string} body.metodoPago - Metodo de pago utilizado (string)
 * [enum('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'cheque', 'otro')].
 * @param {string} body.motivoPago - Motivo del pago (string)
 * [enum('pago_mensualidad', 'pago_importe_cancelacion')].
 * @returns Retorna: ID del pago registrado o error.
 */

//LISTO!!

router.post('/usuario/registrar-pago', async (req: Request, res: Response) => {
  const { registroPolizaId, cantidadPago, metodoPago, motivoPago } = req.body;

	//? 1.1 Validamos que tenemos todos los datos necesarios para el registro de pago
	if (!registroPolizaId || !cantidadPago || !metodoPago || !motivoPago) {
		return res.status(400).json(
			{
				success: false,
				message: 'Error code 0x001 - [Raised] No se han registrado alguno de los campos para este endpoint',
				offender: (!registroPolizaId) ? 'registroPolizaId' :
					(!cantidadPago) ? 'cantidadPago' :
						(!metodoPago) ? 'metodoPago' : 'motivoPago'
			}
		);
	}

	//? 1.2 Validamos que el id de solicitud y la cantidad de pago no sean negativos
	if (Number.parseInt(registroPolizaId) <= 0 || Number.parseFloat(cantidadPago) <= 0) {
		return res.status(400).json(
			{
				success: false,
				message: 'Error code 0x001 - [Raised] El parametro de la URL no es un numero valido'
				+ ' para este endpoint',
				offender: (!registroPolizaId) ? 'registroPolizaId' : 'cantidadPago'
			}
		);
	}

	//? 1.3 Validamos que el metodo de pago sea valido y en el enum correpondiente
	if (!['tarjeta_credito', 'tarjeta_debito', 'efectivo', 'cheque', 'otro'].includes(metodoPago)) {
		return res.status(400).json(
			{
				success: false,
				message: 'Error code 0x001 - [Raised] El metodo de pago no es valido para este endpoint',
				offender: 'metodoPago'
			}
		);
	}

	//? 1.4 Validamos que el motivo de pago sea valido y en el enum correpondiente
	if (!['pago_mensualidad', 'pago_importe_cancelacion'].includes(motivoPago)) {
		return res.status(400).json(
			{
				success: false,
				message: 'Error code 0x001 - [Raised] El motivo de pago no es valido para este endpoint',
				offender: 'motivoPago'
			}
		);
	}

	//? 2 Continuamos con el proceso

  try {
    const connection = await getConnection();
    await connection.execute(
      'CALL MiSeguroDigital.crearRegistroPagoPolizaPorUsuario(?, ?, ?, ?, @codigoResultado, @nuevoPagoId)',
      [registroPolizaId, cantidadPago, metodoPago, motivoPago]
    );

    const [result] =
			await connection.execute('SELECT @codigoResultado as codigo, @nuevoPagoId as pagoId');
    await connection.end();

    const { codigo, pagoId } = Array.isArray(result) && result[0] ? result[0] as any : { codigo: 500, pagoId: null };

    //? 2.1 Para el retorno nos basamos en el codigo, y retrnamos el pagoID solo en caso de 200
		if (codigo === 200) {
			res.status(200).json(
				{
					success: true,
					message: 'Pago registrado correctamente',
					data: pagoId ,
					offender: ''
				}
			);
		} else if (codigo === 404) {
			res.status(codigo).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontraron pagos para la poliza definida',
				offender: 'registryId',
				data: []
			});
		} else {
			res.status(codigo).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Error de la API al registrar el pago',
				offender: 'API Error'
			});
		}
  } catch (error) {
    res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor al registrar pago',
			offender: error
		});
  }
});

/**
 * @description Ruta disenada para la administracion del sistema. En este caso los administradores pueden reembolsar pagos
 * directamente a traves de la API.
 * @param {object} params - Parametros de la URL de la peticion.
 * @param {number} params.pagoId - ID del pago a reembolsar (numero).
 */
router.put('/admin/reembolsar-pago/:pagoId', async (req: Request, res: Response) => {
	const { pagoId } = req.params;

	//? 1.1 Validamos que el id no sea nulo y sea mayor que cero
	if (!pagoId || Number.parseInt(pagoId) <= 0) {
		return res.status(400).json(
			{
				success: false,
				message: 'Error code 0x001 - [Raised] El parametro de la URL no es un numero valido'
				+ ' para este endpoint',
				offender: 'pagoId'
			}
		);
	}

	//? 2. Continuamos con el proceso
	try {
		const connection = await getConnection();
		await connection.execute(
			'CALL MiSeguroDigital.reembolsarPagoPolizaPorUsuario(?, @codigoResultado)',
					[pagoId]);
		const [result] = await connection.execute('SELECT @codigoResultado as codigo');
		await connection.end();

		//? 2.1 Extremos el codigo del resultado y retornamos el mismo en el json
		const outCodigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;

		if (outCodigo === 200) {
				res.status(200).json({
					success: true,
					message: 'Pago reembolsado correctamente',
					offender: ''
				});
		} else if (outCodigo === 404) {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontro el pago definido',
				offender: 'pagoId'
			});
		} else if (outCodigo === 409) {
			res.status(409).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] El pago ya fue reembolsado anteriormente',
				offender: 'pagoId'
			})
		} else if (outCodigo === 400){
			res.status(400).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] El pago no puede ser reembolsado ya que no ' +
					'se encuentra en estado de pago completado',
				offender: 'pagoId'
			})
		} else {
			res.status(outCodigo).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Error de la API al reembolsar el pago',
				offender: 'API Error'
			});
		}
	}
	catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor al reembolsar pago',
			offender: error
		});
	}
});

/**
 * @description Ruta disenada para la administracion del sistema. En este caso los administradores pueden eliminar pagos
 * solamente, y solo pueden hacerlo un vez que estos hayan sido reembolsados.
 * @param {object} params - Parametros de la URL de la peticion.
 * @param {number} params.pagoId - ID del pago a eliminar (numero).
 * @returns Codigo de salida del proceso interno.
 */
router.delete('/admin/eliminar-pago/:pagoId', async (req: Request, res: Response) => {
	const { pagoId } = req.params;

	//? 1.1 Validamos que el id del pago no sea nulo y sea mayor que cero
	if (!pagoId || Number.parseInt(pagoId) <= 0) {
		return res.status(400).json(
			{
				success: false,
				message: 'Error code 0x001 - [Raised] El parametro de la URL no es un numero valido'
				+ ' para este endpoint',
				offender: 'pagoId'
			}
		);
	}

	//? 2. Continuamos con el proceso
	try {
		const connection = await getConnection();
		await connection.execute(
			'CALL MiSeguroDigital.eliminarPagoPolizaPorUsuario(?, @codigoResultado)',
					[pagoId]);
		const [result] = await connection.execute('SELECT @codigoResultado as codigo');
		await connection.end();

		//? 2.1 Extraemos el codigo del resultado y retornamos el mismo en el json
		const outCodigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;

		if (outCodigo === 200) {
				res.status(200).json({
					success: true,
					message: 'Pago eliminado correctamente',
					offender: ''
				});
		} else if (outCodigo === 404) {
			res.status(404).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se encontro el pago definido',
				offender: 'pagoId'
			});
		} else if (outCodigo === 409) {
			res.status(409).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] No se puede eliminar un pago completado, '
					+ 'debe reembolsarse primero',
				offender: 'pagoId'
			})
		} else {
			res.status(outCodigo).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Error de la API al eliminar el pago',
				offender: 'API Error'
			});
		}
	}
	catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error Code 0x001 - [Raised] Error interno del servidor al eliminar pago',
			offender: error
		});
	}
})

export default router;