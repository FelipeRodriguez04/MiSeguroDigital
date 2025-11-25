import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Obtener todos los bienes registrados por un usuario.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario (numero).
 * @returns Retorna: lista de bienes registrados por el usuario.
 */

//LISTO!!

router.get('/usuario/bienes-registrados/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || Number.parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El parametro de la URL no es un numero valido para este endpoint',
      offender: 'userId'
    });
  }

  try {
    const connection = await getConnection();
    const [rows]: any = await connection.execute(
      'CALL MiSeguroDigital.obtenerBienesRegistradosPorUsuario(?)',
      [userId]
    );
    await connection.end();

    const resultRows = Array.isArray(rows) ? rows[0] : [];

    let arrayOfBienes = Array.isArray(resultRows)
      ? resultRows.map((bien: any) => ({
          id_bien: bien.id_bien,
          tipo_de_bien: bien.tipo_de_bien,
          valoracion_bien: bien.valoracion_bien
        }))
      : [];

    if (arrayOfBienes.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Bienes registrados obtenidos correctamente',
        data: arrayOfBienes,
        offender: ''
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] No se encontraron bienes registrados para el usuario',
        offender: 'userId',
        data: []
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor al obtener bienes registrados',
      offender: error
    });
  }
});


/**
 * @description Obtener bienes registrados por usuario filtrados por tipo.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario (numero).
 * @param {object} body - Cuerpo de la consulta.
 * @param {string} body.tipo - Tipo de bien a filtrar (string) [enum('bien_inmueble', 'bien_automotriz', 'otro')].
 * @returns Retorna: lista de bienes registrados por el usuario del tipo especificado.
 */

//LISTO!!

router.get('/usuario/bienes-registrados-por-tipo/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { tipo } = req.body;

  //? 1.1 Validamos que el parametro userId sea valido
  if (!userId || Number.parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El parametro de la URL no es un numero valido para este endpoint',
      offender: 'userId'
    });
  }

  //? 1.2 Validamos que el tipo de bien sea valido
  if (!tipo || !['bien_inmueble', 'bien_automotriz', 'otro'].includes(tipo)) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El tipo de bien no es valido para este endpoint',
      offender: 'tipo'
    });
  }

  //? 2. Continuamos con el proceso
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'CALL MiSeguroDigital.obtenerBienesRegistradosPorUsuarioYTipo(?, ?)',
			[userId, tipo]);
    await connection.end();

    //? 2.1 Transformamos la respuesta en un arreglo de objetos JSON
    let arrayOfBienes = Array.isArray(rows) ? rows.map((bien: any) => ({
      id_bien: bien.id_bien,
      tipo_de_bien: bien.tipo_de_bien,
      valoracion_bien: bien.valoracion_bien
    })) : [];

    if (arrayOfBienes.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Bienes registrados por tipo obtenidos correctamente',
        data: arrayOfBienes,
        offender: ''
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] No se encontraron bienes del tipo especificado para el usuario',
        offender: 'tipo',
        data: []
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor al obtener bienes por tipo',
      offender: error
    });
  }
});

/**
 * @description Obtener bienes asegurados por un usuario.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario (numero).
 * @returns Retorna: lista de bienes asegurados por el usuario con informacion de poliza.
 */

//LISTO!!

router.get('/usuario/bienes-asegurados/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  //? 1. Validamos que el parametro sea un numero y no sea menor que cero
  if (!userId || Number.parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El parametro de la URL no es un numero valido para este endpoint',
      offender: 'userId'
    });
  }

  //? 2. Continuamos con el proceso
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'CALL MiSeguroDigital.obtenerBienesAseguradosPorUsuario(?)', [userId]
    );
    await connection.end();

      const resultRows = Array.isArray(rows) ? rows[0] : [];


    //? 2.1 Transformamos la respuesta en un arreglo de objetos JSON
    let arrayOfBienesAsegurados = Array.isArray(resultRows) ? resultRows.map((bien: any) => ({
      id_bien_del_usuario: bien.id_bien_del_usuario,
      id_registro_en_poliza: bien.id_registro_en_poliza,
      tipo_de_bien: bien.tipo_de_bien,
      valoracion_bien: bien.valoracion_bien,
      tipo_de_poliza: bien.tipo_de_poliza,
      monto_cobertura_total: bien.monto_cobertura_total
    })) : [];

    if (arrayOfBienesAsegurados.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Bienes asegurados obtenidos correctamente',
        data: arrayOfBienesAsegurados,
        offender: ''
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] No se encontraron bienes asegurados para el usuario',
        offender: 'userId',
        data: []
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor al obtener bienes asegurados',
      offender: error
    });
  }
});

/**
 * @description Obtener bienes asegurados por usuario y poliza especifica.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.userId - ID del usuario (numero).
 * @param {number} params.polizaId - ID de la poliza (numero).
 * @returns Retorna: lista de bienes asegurados por el usuario en la poliza especificada.
 */

//LISTO!!

router.get('/usuario/bienes-asegurados-por-poliza/:userId/:polizaId', async (req: Request, res: Response) => {
  const { userId, polizaId } = req.params;

  //? 1.1 Validamos que el parametro userId sea valido
  if (!userId || Number.parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El parametro userId no es un numero valido para este endpoint',
      offender: 'userId'
    });
  }

  //? 1.2 Validamos que el parametro polizaId sea valido
  if (!polizaId || Number.parseInt(polizaId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El parametro polizaId no es un numero valido para este endpoint',
      offender: 'polizaId'
    });
  }

  //? 2. Continuamos con el proceso
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'CALL MiSeguroDigital.obtenerBienesAseguradosPorUsuarioYPoliza(?, ?)', [userId, polizaId]
    );
    await connection.end();

    //? 2.1 Transformamos la respuesta en un arreglo de objetos JSON
    let arrayOfBienesAsegurados = Array.isArray(rows) ? rows.map((bien: any) => ({
      id_bien_del_usuario: bien.id_bien_del_usuario,
      id_registro_en_poliza: bien.id_registro_en_poliza,
      tipo_de_bien: bien.tipo_de_bien,
      valoracion_bien: bien.valoracion_bien,
      tipo_de_poliza: bien.tipo_de_poliza,
      monto_cobertura_total: bien.monto_cobertura_total
    })) : [];

    if (arrayOfBienesAsegurados.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Bienes asegurados por poliza obtenidos correctamente',
        data: arrayOfBienesAsegurados,
        offender: ''
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] No se encontraron bienes asegurados para el usuario en la poliza especificada',
        offender: 'polizaId',
        data: []
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor al obtener bienes asegurados por poliza',
      offender: error
    });
  }
});

/**
 * @description Registrar un nuevo bien para un usuario.
 * @param {object} body - Cuerpo de la peticion.
 * @param {number} body.userId - ID del usuario (numero).
 * @param {string} body.nombreBien - Nombre del bien (string).
 * @param {number} body.valoracionBien - Valoracion del bien (numero decimal).
 * @param {string} body.tipoDeBien - Tipo de bien [enum('bien_inmueble', 'bien_automotriz', 'otro')].
 * @returns Retorna: confirmacion del registro y ID del bien creado.
 */

//LISTO!!

router.post('/usuario/registrar-bien', async (req: Request, res: Response) => {
  const { userId, nombreBien, valoracionBien, tipoDeBien } = req.body;

  //? 1.1 Validamos que userId sea valido
  if (!userId || Number.parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El userId no es un numero valido para este endpoint',
      offender: 'userId'
    });
  }

  //? 1.2 Validamos que nombreBien sea valido
  if (!nombreBien || typeof nombreBien !== 'string' || nombreBien.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El nombreBien no es valido para este endpoint',
      offender: 'nombreBien'
    });
  }

  //? 1.3 Validamos que valoracionBien sea valido
  if (!valoracionBien || Number.parseFloat(valoracionBien) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] La valoracionBien no es valida para este endpoint',
      offender: 'valoracionBien'
    });
  }

  //? 1.4 Validamos que tipoDeBien sea valido
  if (!tipoDeBien || !['bien_inmueble', 'bien_automotriz', 'otro'].includes(tipoDeBien)) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El tipoDeBien no es valido para este endpoint',
      offender: 'tipoDeBien'
    });
  }

  //? 2. Continuamos con el proceso
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'CALL MiSeguroDigital.registrarBienPorUsuario(?, ?, ?, ?, @codigoOperacion, @idBienRegistrado)',
      [userId, nombreBien, valoracionBien, tipoDeBien]
    );
    
    const [result] = await connection.execute('SELECT @codigoOperacion as codigo, @idBienRegistrado as idBien');
    await connection.end();

    const { codigo, idBien } = Array.isArray(result) ? (result[0] as any) : { codigo: 500, idBien: -1};

    if (codigo === 200) {
      res.status(201).json({
        success: true,
        message: 'Bien registrado correctamente',
        data: { idBienRegistrado: idBien },
        offender: ''
      });
    } else if (codigo === 404) {
      res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Usuario no encontrado',
        offender: 'userId'
      });
    } else if (codigo === 409) {
      res.status(409).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Ya existe un bien con las mismas caracteristicas',
        offender: 'duplicado'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] API Error al registrar el bien',
        offender: 'API Error'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor al registrar bien',
      offender: error
    });
  }
});

/**
 * @description Modificar un bien registrado por un usuario.
 * @param {object} body - Cuerpo de la peticion.
 * @param {number} body.idBien - ID del bien (numero).
 * @param {number} body.userId - ID del usuario (numero).
 * @param {string} body.nombreBien - Nombre del bien (string).
 * @param {number} body.valoracionBien - Valoracion del bien (numero decimal).
 * @param {string} body.tipoDeBien - Tipo de bien [enum('bien_inmueble', 'bien_automotriz', 'otro')].
 * @returns Retorna: confirmacion de la modificacion.
 */

//LISTO!!

router.put('/usuario/modificar-bien', async (req: Request, res: Response) => {
  const { idBien, userId, nombreBien, valoracionBien, tipoDeBien } = req.body;

  //? 1.1 Validamos que idBien sea valido
  if (!idBien || Number.parseInt(idBien) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El idBien no es un numero valido para este endpoint',
      offender: 'idBien'
    });
  }

  //? 1.2 Validamos que userId sea valido
  if (!userId || Number.parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El userId no es un numero valido para este endpoint',
      offender: 'userId'
    });
  }

  //? 1.3 Validamos que nombreBien sea valido
  if (!nombreBien || typeof nombreBien !== 'string' || nombreBien.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El nombreBien no es valido para este endpoint',
      offender: 'nombreBien'
    });
  }

  //? 1.4 Validamos que valoracionBien sea valido
  if (!valoracionBien || Number.parseFloat(valoracionBien) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] La valoracionBien no es valida para este endpoint',
      offender: 'valoracionBien'
    });
  }

  //? 1.5 Validamos que tipoDeBien sea valido
  if (!tipoDeBien || !['bien_inmueble', 'bien_automotriz', 'otro'].includes(tipoDeBien)) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El tipoDeBien no es valido para este endpoint',
      offender: 'tipoDeBien'
    });
  }

  //? 2. Continuamos con el proceso
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'CALL MiSeguroDigital.modificarBienRegistradoPorUsuario(?, ?, ?, ?, ?, @codigoOperacion)',
      [idBien, userId, nombreBien, valoracionBien, tipoDeBien]
    );
    
    const [result] = await connection.execute('SELECT @codigoOperacion as codigo');
    await connection.end();

    const { codigo } = (result as any)[0];

    if (codigo === 200) {
      res.status(200).json({
        success: true,
        message: 'Bien modificado correctamente',
        offender: ''
      });
    } else if (codigo === 404) {
      res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Bien no encontrado o no pertenece al usuario',
        offender: 'idBien'
      });
    } else if (codigo === 409) {
      res.status(409).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] La modificacion generaria un bien duplicado',
        offender: 'duplicado'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] API Error al modificar el bien',
        offender: 'API Error'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor al modificar bien',
      offender: error
    });
  }
});

/**
 * @description Eliminar un bien registrado por un usuario.
 * @param {object} body - Cuerpo de la peticion.
 * @param {number} body.idBien - ID del bien (numero).
 * @param {number} body.userId - ID del usuario (numero).
 * @returns Retorna: confirmacion de la eliminacion.
 */

//LISTO!!

router.delete('/usuario/eliminar-bien', async (req: Request, res: Response) => {
  const { idBien, userId } = req.body;

  //? 1.1 Validamos que idBien sea valido
  if (!idBien || Number.parseInt(idBien) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El idBien no es un numero valido para este endpoint',
      offender: 'idBien'
    });
  }

  //? 1.2 Validamos que userId sea valido
  if (!userId || Number.parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El userId no es un numero valido para este endpoint',
      offender: 'userId'
    });
  }

  //? 2. Continuamos con el proceso
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'CALL MiSeguroDigital.eliminarBienRegistradoPorUsuario(?, ?, @codigoOperacion)',
      [idBien, userId]
    );
    
    const [result] = await connection.execute('SELECT @codigoOperacion as codigo');
    await connection.end();

    const { codigo } = (result as any)[0];

    if (codigo === 200) {
      return res.status(200).json({
        success: true,
        message: 'Bien eliminado correctamente',
        offender: ''
      });
    } else if (codigo === 404) {
      return res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Bien no encontrado o no pertenece al usuario',
        offender: 'idBien'
      });
    } else if (codigo === 403) {
      return res.status(403).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] No se puede eliminar un bien que esta asegurado',
        offender: 'bienAsegurado'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Error interno del servidor',
        offender: 'servidor'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor al eliminar bien',
      offender: error
    });
  }
});

/**
 * @description Eliminar seguro de un bien registrado por un usuario.
 * @param {object} body - Cuerpo de la peticion.
 * @param {number} body.idBien - ID del bien (numero).
 * @param {number} body.idRegistroEnPoliza - ID del registro en poliza (numero).
 * @returns Retorna: confirmacion de la eliminacion del seguro.
 */

//LISTO!!

router.delete('/admin/eliminar-seguro-bien', async (req: Request, res: Response) => {
  const { idBien, idRegistroEnPoliza } = req.body;

  //? 1.1 Validamos que idBien sea valido
  if (!idBien || Number.parseInt(idBien) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El idBien no es un numero valido para este endpoint',
      offender: 'idBien'
    });
  }

  //? 1.2 Validamos que idRegistroEnPoliza sea valido
  if (!idRegistroEnPoliza || Number.parseInt(idRegistroEnPoliza) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Error code 0x001 - [Raised] El idRegistroEnPoliza no es un numero valido para este endpoint',
      offender: 'idRegistroEnPoliza'
    });
  }

  //? 2. Continuamos con el proceso
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'CALL MiSeguroDigital.eliminarSeguroBienRegistradoPorUsuario(?, ?, @codigoOperacion)',
      [idBien, idRegistroEnPoliza]
    );
    
    const [result] = await connection.execute('SELECT @codigoOperacion as codigo');
    await connection.end();

    const { codigo } = (result as any)[0];

    if (codigo === 200) {
      res.status(200).json({
        success: true,
        message: 'Seguro del bien eliminado correctamente',
        offender: ''
      });
    } else if (codigo === 404) {
      res.status(404).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] No se encontro la asociacion del bien con la poliza',
        offender: 'asociacion'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error Code 0x001 - [Raised] Error interno del servidor',
        offender: 'servidor'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Code 0x001 - [Raised] Error interno del servidor al eliminar seguro del bien',
      offender: error
    });
  }
});

export default router;