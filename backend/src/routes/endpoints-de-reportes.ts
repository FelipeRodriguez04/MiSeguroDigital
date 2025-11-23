import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();


/**
 * @description Endpoint disenado para obtener un reporte completo de todas
 * las aplicaciones en general a polizas una determinada aseguradora. Esta ruta implementa
 * una vista compleja que retorna un conjunto de datos de polizas, usuarios, aseguradoras y documentos
 * @param {object} params - Parametros de la URL de la peticion.
 * @param {number} params.idAseguradora - ID de la aseguradora (numero).
 * @returns Retorna: reporte completo de aplicaciones de polizas.
 */

//LISTO!!

router.get('/broker/reporte-solicitudes-totales/:idAseguradora', async (req: Request, res: Response) =>
	{
		const { idAseguradora } = req.params;

		//? 1. Validamos si el id existe y si no es menor que cero
		if (!idAseguradora || Number.parseInt(idAseguradora) <= 0) {
			res.status(400).json({
				success: false,
				message: 'Error code 0x001 - [Raised] El ID de la aseguradora no es valido',
				offender: 'idAseguradora'
			});
		}

		//? 2. Procedemos con la query normal
		try {
			const connection = await getConnection();

			const [rows] =
				await connection.execute(
					'select * from MiSeguroDigital.viewDetallesDeAplicacionPorUsuarios where id_aseguradora = ?', [idAseguradora]);

			await connection.end();

			//? 2.1 En base a la selecccion y a la salida de la aseguradora vamos a enviar un json con todos los datos
			let arrayDePolizas = Array.isArray(rows) ? rows.map((poliza: any) => ({
				id_aplicacion_poliza: poliza.id_aplicacion_poliza,
				fecha_de_aplicacion: poliza.fecha_de_aplicacion,
				estado_actual_aplicacion: poliza.estado_actual_aplicacion,
				id_usuario: poliza.id_usuario,
				full_nombre_usuario: poliza.full_nombre_usuario,
				correo_registro: poliza.correo_registro,
				numero_telefono_usuario: poliza.numero_telefono_usuario,
				fecha_nacimiento_usuario: poliza.fecha_nacimiento_usuario,
				id_poliza: poliza.id_poliza,
				nombre_de_la_poliza: poliza.nombre_de_la_poliza,
				descripcion_de_la_poliza: poliza.descripcion_de_la_poliza,
				pago_mensual: poliza.pago_mensual,
				monto_cobertura_total: poliza.monto_cobertura_total,
				nombre_aseguradora: poliza.nombre_aseguradora,
				id_aseguradora: poliza.id_aseguradora,
				cantidad_documentos: poliza.cantidad_documentos
			})) : [];

			//? 2.2 Enviamos la data si tenemos salida
			if (arrayDePolizas.length > 0) {
				res.status(200).json({
					success: true,
					message: 'Reporte de solicitudes totales generado correctamente',
					data: arrayDePolizas,
					offender: ''
				});
			} else {
				res.status(404).json({
					success: false,
					message: 'Error Code 0x001 - [Raised] No se encontraron solicitudes para esta aseguradora',
					offender: 'idAseguradora'
				});
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Error Code 0x001 - [Raised] Error interno del servidor',
				offender: error
			});
		}
	}
)



/**
 * @description Obtener estadisticas y reportes de broker.
 * @note Sin parametros.
 * @returns Retorna: estadisticas completas de rendimiento de brokers.
 */

//LISTO!!

router.get('/broker/estadistica-solicitudes-por-poliza', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM viewEstadisticasDeSolicitudesReporteParaBrokers');
    await connection.end();

		//? 1. En base a la respuesta de la db, vamos a convertirlo en un objeto json
		let arrayOfReportes = Array.isArray(rows) ? rows.map((reporte: any) => ({
			id_aseguradora: reporte.id_aseguradora,
			nombre_aseguradora: reporte.nombre_aseguradora,
			nombre_de_la_poliza: reporte.nombre_de_la_poliza,
			estado_de_poliza: reporte.estado_de_poliza,
			descripcion_de_la_poliza: reporte.descripcion_de_la_poliza,
			total_aplicaciones: reporte.total_aplicaciones,
			aplicaciones_pendientes: reporte.aplicaciones_pendientes,
			aprobadas: reporte.aplicaciones_aprobadas,
			aplicaciones_rechazadas: reporte.aplicaciones_rechazadas
		})) : [];


		//? 2. Si hay data retornamos el json
		if (arrayOfReportes.length > 0) {
			res.status(200).json({
				success: true,
				message: 'Estadisticas de solicitudes por poliza generadas correctamente',
				data: arrayOfReportes,
				offender: ''
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'No se encontraron solicitudes para esta aseguradora',
				data: [],
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

export default router;