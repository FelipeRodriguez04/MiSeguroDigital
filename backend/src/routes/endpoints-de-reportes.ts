import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Obtener estadisticas y reportes de broker.
 * @note Sin parametros.
 * @returns Retorna: estadisticas completas de rendimiento de brokers.
 */
router.get('/broker/estadisticas', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM estadisticas_reportes_broker_view');
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;