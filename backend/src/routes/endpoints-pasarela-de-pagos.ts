import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Obtener historial de pagos de un usuario.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.registryId - ID del registro de poliza del usuario (numero).
 * @returns Retorna: historial completo de pagos del usuario.
 */
router.get('/usuario/:registryId', async (req: Request, res: Response) => {
  const { registryId } = req.params;
  
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('CALL obtener_pagos_usuario(?)', [registryId]);
    await connection.end();
    
    res.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @description Registrar nuevo pago de poliza.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.registroPolizaId - ID del registro de la poliza (numero).
 * @param {number} body.cantidadPago - Monto del pago (decimal).
 * @param {string} body.metodoPago - Metodo de pago utilizado (string).
 * @param {string} body.motivoPago - Motivo del pago (string).
 * @returns Retorna: ID del pago registrado o error.
 */
router.post('/registrar', async (req: Request, res: Response) => {
  const { registroPolizaId, cantidadPago, metodoPago, motivoPago } = req.body;
  
  try {
    const connection = await getConnection();
    await connection.execute(
      'CALL registrar_pago_poliza(?, ?, ?, ?, @codigoResultado, @nuevoPagoId)',
      [registroPolizaId, cantidadPago, metodoPago, motivoPago]
    );
    
    const [result] = await connection.execute('SELECT @codigoResultado as codigo, @nuevoPagoId as pagoId');
    await connection.end();
    
    const { codigo, pagoId } = Array.isArray(result) && result[0] ? result[0] as any : { codigo: 500, pagoId: null };
    
    if (codigo === 200) {
      res.json({ success: true, pagoId, message: 'Pago registrado correctamente' });
    } else {
      res.status(codigo === 404 ? 404 : 400).json({ success: false, message: 'Error al registrar pago' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;