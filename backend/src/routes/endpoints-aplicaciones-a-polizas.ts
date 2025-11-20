import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Crear nueva aplicacion de poliza.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.usuarioId - ID del usuario (numero).
 * @param {number} body.polizaId - ID de la poliza (numero).
 * @returns Retorna: confirmacion de creacion o error.
 */
router.post('/crear-poliza', async (req: Request, res: Response) => {
  const { usuarioId, polizaId } = req.body;
  
  try {
    const connection = await getConnection();
    await
        connection.execute(
            'CALL MiSeguroDigital.crearAplicacionEnPolizaPorUsuario(?, ?, @codigoResultado)',
            [usuarioId, polizaId]
        );
    
    const [result] = await connection.execute('SELECT @codigoResultado as codigo');
    await connection.end();
    
    const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;
    
    if (codigo === 200) {
      res.status(200).json({ success: true, message: 'Aplicacion creada correctamente' });
    } else if (codigo == 404){
        res.status(404).json({ success: false, message: 'Error al crear aplicacion: Puede que ' +
                'la poliza o el usuario ya no existan' });
    } else {
        res.status(codigo).json({ success: false, message: 'Error al crear aplicacion' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Obtener aplicaciones de un usuario especifico.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario (numero).
 * @returns Retorna: lista de aplicaciones del usuario.
 */
router.get('/aplicaciones-usuario/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  try {
    const connection = await getConnection();
    const [rows] = await
        connection.execute(
            'SELECT * FROM MiSeguroDigital.viewAplicacionesPolizaPorUsuario WHERE id_usuario = ?',
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
});

/**
 * @description Obtener aplicaciones pendientes para revision de broker.
 * @note Sin parametros.
 * @returns Retorna: lista de aplicaciones pendientes de aprobacion.
 */
router.get('/broker/aplicaciones-pendientes', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM MiSeguroDigital.viewAplicacionesPendientesPorBroker');
    await connection.end();
    
    res.json(rows);
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
 * @param {string} body.decision - Decision sobre la aplicacion (string).
 * @param {string} [body.razonRechazo] - Razon de rechazo (string opcional).
 * @returns Retorna: confirmacion de procesamiento o error.
 */
router.put('/procesar/:applicationId', async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const { brokerAnalistaId, decision, razonRechazo } = req.body;
  
  try {
    const connection = await getConnection();
    await connection.execute(
      'CALL MiSeguroDigital.procesarAplicacionEnPolizaPorUsuario(?, ?, ?, ?, @codigoResultado)',
      [applicationId, brokerAnalistaId, decision, razonRechazo]
    );
    
    const [result] = await connection.execute('SELECT @codigoResultado as codigo');
    await connection.end();
    
    const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;
    
    if (codigo === 200) {
      res.json({ success: true, message: 'Aplicacion procesada correctamente' });
    } else {
      res.status(codigo === 404 ? 404 : codigo === 409 ? 409 : 400).json({ success: false, message: 'Error al procesar aplicacion' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Obtener detalles completos de una aplicacion especifica.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.applicationId - ID de la aplicacion (numero).
 * @returns Retorna: detalles completos de la aplicacion incluyendo datos del usuario y poliza.
 */
router.get('/:applicationId/details', async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  
  try {
    const connection = await getConnection();
    // TODO: Use v_aplicacion_detalles view (viewDetallesDeAplicacionPorUsuarios)
    await connection.end();
    
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @description Formalizar registro de usuario en poliza despues de aprobacion.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.applicationId - ID de la aplicacion aprobada (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.fechaInicio - Fecha de inicio del registro (string).
 * @param {string} body.fechaFinalizacion - Fecha de finalizacion del registro (string).
 * @param {boolean} body.autoRenew - Si la poliza tiene auto-renovacion (boolean).
 * @param {number} body.brokerId - ID del broker que formaliza el registro (numero).
 * @returns Retorna: confirmacion de registro formalizado o error.
 */
router.post('/:applicationId/register', async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const { fechaInicio, fechaFinalizacion, autoRenew, brokerId } = req.body;
  
  try {
    const connection = await getConnection();
    // TODO: Call tx_registrar_usuario_en_poliza stored procedure
    await connection.end();
    
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;