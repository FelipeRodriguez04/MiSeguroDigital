import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';
import { generateSalt, hashPassword } from '../config/moduloAutenticacionSimple';
import {QueryResult} from "mysql2";

const router = Router();

/**
 * @description Crear nuevo broker.
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
 * @param {string} body.rolBroker - Rol del broker (string).
 * @param {number} body.adminId - ID del administrador que crea el broker (numero).
 * @returns Retorna: ID del broker creado o error de registro.
 */
router.post('/', async (req: Request, res: Response) => {
  const {
      email,password,
      nombrePrim, apellidoPrim,
      fullNombre, telefono,
      fechaNacimiento, aseguradoraId,
      rolBroker, adminId } = req.body;
  let estadoBroker = req.body.estadoBroker;

  if(estadoBroker === null || estadoBroker === 'rechazado') {
      estadoBroker = 'pendiente';
  }
  
  try {
    const connection = await getConnection();
    
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    
    await connection.execute(
      'CALL MiSeguroDigital.crearBrokerManual(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @codigoResultado, @nuevoBrokerId)',
      [email, hashedPassword, salt, nombrePrim, apellidoPrim, fullNombre, telefono,
          fechaNacimiento, aseguradoraId, estadoBroker,rolBroker, adminId]
    );
    
    const [result] = await connection.execute('SELECT @codigoResultado as codigo, @nuevoBrokerId as brokerId');
    await connection.end();
    
    const { codigo, brokerId } = Array.isArray(result) && result[0] ? result[0] as any : { codigo: 500, brokerId: null };
    
    if (codigo === 200) {
      res.json({ success: true, brokerId, message: 'Broker creado correctamente' });
    } else if (codigo === 409) {
      res.status(409).json({ success: false, message: 'El correo ya esta registrado' });
    } else {
      res.status(400).json({ success: false, message: 'Error al crear broker' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Actualizar broker existente.
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
router.put('/:brokerId', async (req: Request, res: Response) => {
  const { brokerId } = req.params;
  const { nombrePrim, apellidoPrim,
        fullNombre, telefono,
        fechaNacimiento, adminId,
        rolBrokerNuevo } = req.body;
  
  try {
    const connection = await getConnection();
    
    await connection.execute(
      'CALL MiSeguroDigital.actualizarBrokerManual(?, ?, ?, ?,?, ?, ?,?, @codigoResultado)',
      [brokerId, nombrePrim, apellidoPrim, fullNombre, telefono,
          fechaNacimiento, rolBrokerNuevo, adminId]
    );
    
    const [result] = await connection.execute('SELECT @codigoResultado as codigo');
    await connection.end();
    
    const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;
    
    if (codigo === 200) {
      res.json({ success: true, message: 'Broker actualizado correctamente' });
    } else if (codigo === 404) {
      res.status(404).json({ success: false, message: 'Broker no encontrado' });
    } else {
      res.status(400).json({ success: false, message: 'Error al actualizar broker' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
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
router.delete('/:brokerId', async (req: Request, res: Response) => {
  const { brokerId } = req.params;
  const { adminId } = req.body;
  
  try {
    const connection = await getConnection();
    
    await
        connection
            .execute(
                'CALL MiSeguroDigital.eliminarBrokerManual(?, ?, @codigoResultado)',
                [brokerId, adminId]);
    
    const [result, metadata] = await connection.execute('SELECT @codigoResultado as codigo');
    await connection.end();
    
    const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;
    
    if (codigo === 200) {
      res.json({ success: true, message: 'Broker eliminado correctamente' });
    } else if (codigo === 404) {
      res.status(404).json({ success: false, message: 'Broker no encontrado' });
    } else {
      res.status(400).json({ success: false, message: 'Error al eliminar broker' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Actualizar estado de broker (aprobar/rechazar).
 * @param {object} params - Parametros de la URL.
 * @param {number} params.brokerId - ID del broker (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.accionARealizar - Define la accion a realizar, sea aprobar o rechazar (string) que se va a enviar
 * a la API
 * @param {string} body.rolInicial - Rol inicial del broker (string) Esta debe ser una string usada para definir
 * el estado al que se va a enviar como base al broker, por ejemplo: broker_analyst, broker_broker, broker_admin. El default
 * si este parametro no se envia es el broker_analyst.
 * @param {number} body.adminId - ID del administrador que aprueba/rechaza (numero).
 * @returns Retorna: confirmacion de cambio de estado o error.
 */
router.put('/:brokerId/estado-broker', async (req: Request, res: Response) => {
  const { brokerId } = req.params;
  let { accionARealizar, rolInicial, adminId } = req.body;

  //? 1. Si no viene un rolInicial, asignamos rol base como broker_analyst
  if (rolInicial === null) {
      rolInicial = 'broker_analyst';
  }

  try {
      //? 1. Obtenemos una conexion a la base de datos
    const connection = await getConnection();
    
    await connection
        .execute(
            'CALL MiSeguroDigital.aprobarORechazarBrokerManual(?, ?, ?, ?, @codigoResultado)',
            [brokerId, accionARealizar, rolInicial, adminId]);

    /*Esta estructura nos permite identificar dos componentes de una promesa de mySQL2, la data y la metadta
    * de la consulta*/
    const [result, metadata] = await connection.execute('SELECT @codigoResultado as codigo');

    await connection.end();

    //? 2. Extraemos el codigo para saber si la actualizacion fue exitosa
    const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;
    
    if (codigo === 200) {
      res.json({ success: true, message: 'Estado del broker actualizado correctamente' });
    } else if (codigo === 404) {
      res.status(404).json({ success: false, message: 'Broker no encontrado' });
    } else {
      res.status(400).json({ success: false, message: 'Error al actualizar estado del broker' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Obtener perfil de broker por ID.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.brokerId - ID del broker (numero).
 * @returns Retorna: datos del perfil del broker en formato JSON.
 */
router.get('/:brokerId', async (req: Request, res: Response) => {
    const { brokerId } = req.params;

    try {
        const connection = await getConnection();

        const [rows] = await connection.execute('CALL MiSeguroDigital.getBrokerDataPerBrokerID(?, @ResultCode)', [brokerId]);
        const [resultCode, metadata] = await connection.execute('SELECT @ResultCode as codigo');

        await connection.end();

        const codigo = Array.isArray(resultCode) && resultCode[0] ? (resultCode[0] as any).codigo : 500;

        if (codigo === 200 && Array.isArray(rows) && rows.length > 0) {
            const brokerData = rows[0] as any;
            res.json({
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
            });
        } else {
            res.status(404).json({ message: 'Broker no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;