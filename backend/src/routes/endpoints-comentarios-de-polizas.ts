import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Obtener comentarios de una poliza especifica.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza (numero).
 * @returns Retorna: lista de comentarios y reviews de la poliza.
 */
router.get('/poliza/:policyId', async (req: Request, res: Response) => {
  const { policyId } = req.params;
  
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('CALL obtener_comentarios_poliza(?)', [policyId]);
    await connection.end();
    
    res.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @description Crear nuevo comentario/review de poliza.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.usuarioId - ID del usuario que comenta (numero).
 * @param {number} body.polizaId - ID de la poliza que se comenta (numero).
 * @param {number} body.rating - Calificacion de la poliza (numero).
 * @param {string} body.contexto - Texto del comentario (string).
 * @param {boolean} body.tieneHiddenFees - Indicador de tarifas ocultas (boolean).
 * @param {string} [body.detalleHiddenFees] - Detalle de las tarifas ocultas (string opcional).
 * @returns Retorna: ID del review creado o error.
 */
router.post('/crear', async (req: Request, res: Response) => {
  const { usuarioId, polizaId, rating, contexto, tieneHiddenFees, detalleHiddenFees } = req.body;
  
  try {
    const connection = await getConnection();
    await connection.execute(
      'CALL crear_comentario_poliza(?, ?, ?, ?, ?, ?, @codigoResultado, @nuevoReviewId)',
      [usuarioId, polizaId, rating, contexto, tieneHiddenFees, detalleHiddenFees]
    );
    
    const [result] = await connection.execute('SELECT @codigoResultado as codigo, @nuevoReviewId as reviewId');
    await connection.end();
    
    const { codigo, reviewId } = Array.isArray(result) && result[0] ? result[0] as any : { codigo: 500, reviewId: null };
    
    if (codigo === 200) {
      res.json({ success: true, reviewId, message: 'Comentario creado correctamente' });
    } else {
      res.status(codigo === 403 ? 403 : 400).json({ success: false, message: 'Error al crear comentario' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;