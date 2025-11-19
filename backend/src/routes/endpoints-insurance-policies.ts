import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';

const router = Router();

/**
 * @description Obtener catalogo completo de polizas disponibles.
 * @note Sin parametros.
 * @returns Retorna: lista completa de polizas en el catalogo.
 */
router.get('/catalogo', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM MiSeguroDigital.viewPolizaCatalogoCompleto');
    await connection.end();
    
    //? 2. Como el retorno es una serie de rows de data, vamos a transformarlas en un objeto de JSON
      let arrayOfPolizas = Array.isArray(rows) ? rows.map((row: any) => ({
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
        estado_de_la_poliza: row.estado_de_poliza
    })):[];

    if (arrayOfPolizas.length > 0) {
      res.status(200).json(arrayOfPolizas);
    } else {
      res.status(404).json({ message: 'No se encontraron polizas en el catalogo' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @description Buscar polizas por diferentes criterios. En la implementacion final de la API,
 * se espera que los criterios de busqueda sean excluyentes, y se especifiquen en base a los posibles valores por tipo
 * @param {object} query - Parametros de consulta.
 * @param {string} [query.type] - Tipo de poliza a buscar (string)
 * [enum('seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud')].
 * @param {string} [query.company] - Compania de seguros a buscar (string).
 * @param {string} [query.name] - Nombre de la poliza a buscar (string).
 * @returns Retorna: polizas que coinciden con los criterios de busqueda.
 */
router.get('/catalogo/search', async (req: Request, res: Response) => {
  const { type, company, name } = req.query;

  if (type !== null && type !== undefined && typeof type !== 'string') {
    return res.status(400).json({ message: 'El tipo de poliza debe ser un string' });
  };
  if (company !== null && company !== undefined && typeof company !== 'string') {
    return res.status(400).json({ message: 'La compania debe ser un string' });
  }
  if (name !== null && name !== undefined && typeof name !== 'string') {
      return res.status(400).json({ message: 'El nombre de la poliza debe ser un string' });
  }

  //? Validacion de pertenencia al enum de cada tipo
  if (type && !['seguro_automotriz', 'seguro_inmobiliario',
      'seguro_de_vida', 'seguro_de_salud'].includes(type)) {
    return res.status(400).json({ message: 'El tipo de poliza no es valido' });
  }


  try {
    const connection = await getConnection();
    let rows;
    
    if (type) {
      [rows] = await connection.execute('CALL MiSeguroDigital.buscarPolizaPorTipo(?)', [type]);
    } else if (company) {
      [rows] = await connection.execute('CALL MiSeguroDigital.buscarPolizaPorAseguradora(?)', [company]);
    } else if (name) {
      [rows] = await connection.execute('CALL MiSeguroDigital.buscarPolizaPorNombreParcial(?)', [name]);
    } else {
      [rows] = await connection.execute('SELECT * FROM MiSeguroDigital.viewPolizaCatalogoCompleto');
    }
    
    await connection.end();

    //? Para el retorno vamos a definir los endpoints con sus respectivas salidas JSON
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
    })): [];

    if (arrayOfPolizas.length > 0) {
      res.status(200).json(arrayOfPolizas);
    } else {
      res.status(404).json({ message: 'No se encontraron polizas en el catalogo' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
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

  // Validacin de que los enums tengan data y sean correctos
  if (!['seguro_automotriz', 'seguro_inmobiliario', 'seguro_de_vida', 'seguro_de_salud'].includes(tipoPoliza)) {
    return res.status(400).json({ message: 'El tipo de poliza no es valido' });
  }
  if (!['activa', 'pausada', 'despublicada'].includes(estadoInicial)) {
      return res.status(400).json({ message: 'El estado inicial no es valido' });
  }

  try {
    const connection = await getConnection();
    await connection.execute(
      'CALL MiSeguroDigital.crearPolizaPorBrokerAdmin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @codigoResultado, @nuevaPolizaId)',
      [aseguradoraId, nombrePoliza, descripcion, tipoPoliza, pagoMensual,
          montoCobertura, duracionContrato, porcentajeAprobacion, importeCancelacion,
          estadoInicial, brokerId]
    );
    
    const [result, metadata] =
        await connection.execute('SELECT @codigoResultado as codigo, @nuevaPolizaId as polizaId');
    await connection.end();
    
    const { codigo, polizaId } = Array.isArray(result) && result[0] ? result[0] as any : { codigo: 500, polizaId: null };
    
    if (codigo === 200) {
      res.json({ success: true, id_poliza: polizaId, message: 'Poliza creada correctamente' });
    } else if (codigo == 404) {
      res.status(codigo).json({ success: false, message: 'Aseguradora no encontrada' });
    } else {
      res.status(codigo).json({ success: false, message: 'Error al crear poliza' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
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
router.put('/admin/actualizar/:policyId', async (req: Request, res: Response) => {
  const { policyId } = req.params;
  const { nombrePoliza, descripcion, tipoPoliza,
      pagoMensual, montoCobertura, duracionContrato,
      porcentajeAprobacion, importeCancelacion, estadoPoliza, brokerId } = req.body;
  
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
        res.json({ success: true, message: 'Poliza actualizada correctamente' });
    } else if (codigo === 404) {
        res.status(codigo).json({ success: false, message: 'Poliza no encontrada' });
    }else {
        res.status(codigo).json({ success: false, message: 'Error al actualizar poliza' });
    }
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Eliminar poliza.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza a eliminar (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.brokerId - ID del broker que elimina la poliza (numero).
 * @returns Retorna: confirmacion de eliminacion o error.
 */
router.delete('/eliminar/:policyId', async (req: Request, res: Response) => {
  const { policyId } = req.params;
  const { brokerId } = req.body;
  
  try {
    const connection = await getConnection();
    await connection.execute('CALL MiSeguroDigital.eliminarPolizaPorAdminBroker(?, ?, @codigoResultado)',
        [policyId, brokerId]);
    
    const [result] = await connection.execute('SELECT @codigoResultado as codigo');
    await connection.end();
    
    const codigo = Array.isArray(result) && result[0] ? (result[0] as any).codigo : 500;
    
    if (codigo === 200) {
      res.json({ success: true, message: 'Poliza eliminada correctamente' });
    }  else if (codigo === 404) {
        res.status(codigo).json({ success: false, message: 'Poliza no encontrada' });
    }else {
        res.status(codigo).json({ success: false, message: 'Error al eliminar poliza' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Obtener datos de polizas para analistas (solo lectura).
 * @note Sin parametros.
 * @returns Retorna: vista de solo lectura de polizas para analisis.
 */
router.get('/analyst/dashboard', async (req: Request, res: Response) => {
  try {
      const connection = await getConnection();
      const [rows] = await connection.execute('SELECT * FROM MiSeguroDigital.viewPolizasBrokerAnalista');
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
          totalPendientes: row.apliaciones_pendientes,
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
 * @description Obtener dashboard completo para admin brokers.
 * @note Sin parametros.
 * @returns Retorna: vista completa de polizas y metricas para administradores broker.
 */

router.get('/admin/dashboard', async (req: Request, res: Response) => {
    try {
        const connection = await getConnection();
        //? 1. Para formar el resumen de la base de datos en el backend, lo primer es intentar
        //? obtener la informacion de las polizas basicas y las aseguradoras, lo que nos da una idea de
        //? las personas registradas y activas, asi como de las metricas de arriba.
        const [basicRows] = await connection.execute('SELECT * FROM viewInformacionPolizaBasica');
        const [byCompanyRows] = await connection.execute('SELECT * FROM viewPolizaInfoPorAseguradora');
        await connection.end();

        //? 1.1 De aqui sacamos la data de las insurance policies base, es decir la informacion colectiva
        //? que se le da a los analistas
        const basicPolicies = Array.isArray(basicRows) ? basicRows.map((row: any) => ({
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
                dominio_correo: row.dominio_correo_aseguradora
            },
            estadisticas_aplicaciones: {
                total_aplicaciones: row.total_aplicaciones,
                aplicaciones_pendientes: row.aplicaciones_pendientes,
                aplicaciones_aprobadas: row.aplicaciones_aprobadas
            }
        })) : [];

        //? 1.2 Sacamos la data agrupada de la tabla de agrupacion por aseguradoras
        const policiesByCompany = Array.isArray(byCompanyRows) ? byCompanyRows.map((row: any) => ({
            aseguradora: {
                id_aseguradora: row.id_aseguradora,
                nombre_aseguradora: row.nombre_aseguradora
            },
            poliza: {
                id_poliza: row.id_poliza
            },
            metricas: {
                total_aplicaciones: row.total_aplicaciones,
                registros_activos: row.registros_activos,
                popularidad_poliza: row.popularidad_poliza
            }
        })) : [];

        // Create comprehensive dashboard response
        const dashboardData = {
            resumen_general: {
                total_polizas: basicPolicies.length,
                polizas_activas: basicPolicies.filter(p => p.estado_poliza === 'activa').length,
                polizas_pausadas: basicPolicies.filter(p => p.estado_poliza === 'pausada').length,
                total_aplicaciones_pendientes: basicPolicies.reduce((sum, p) => sum + p.estadisticas_aplicaciones.aplicaciones_pendientes, 0),
                total_aplicaciones_aprobadas: basicPolicies.reduce((sum, p) => sum + p.estadisticas_aplicaciones.aplicaciones_aprobadas, 0)
            },
            polizas_detalladas: basicPolicies,
            polizas_por_aseguradora: policiesByCompany,
            metricas_por_aseguradora: groupByInsuranceCompany(policiesByCompany)
        };

        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

function groupByInsuranceCompany(policiesByCompany: any[]) {
    const grouped = policiesByCompany.reduce((acc, item) => {
        const companyName = item.aseguradora.nombre_aseguradora;
        if (!acc[companyName]) {
            acc[companyName] = {
                id_aseguradora: item.aseguradora.id_aseguradora,
                nombre_aseguradora: companyName,
                total_polizas: 0,
                total_aplicaciones: 0,
                total_registros_activos: 0,
                polizas_alta_popularidad: 0
            };
        }

        acc[companyName].total_polizas += 1;
        acc[companyName].total_aplicaciones += item.metricas.total_aplicaciones;
        acc[companyName].total_registros_activos += item.metricas.registros_activos;
        if (item.metricas.popularidad_poliza === 'Alta') {
            acc[companyName].polizas_alta_popularidad += 1;
        }

        return acc;
    }, {});

    //? Al final, este metodod es como un lambda en JHava, este ultimo csao lo que hace es
    // obtener la data de  un formato de objetos similar a un groupingBy ede Java
    return Object.values(grouped);
}




/**
 * @description Obtener todos los requisitos de una poliza.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza (numero).
 * @returns Retorna: lista de requisitos de la poliza especificada.
 */
router.get('/:policyId/requirements', async (req: Request, res: Response) => {
  const { policyId } = req.params;
  
  try {
    const connection = await getConnection();
    // TODO: Use v_poliza_requisitos view
    await connection.end();
    
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @description Agregar nuevo requisito a una poliza.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.tipoRequerimiento - Tipo de requerimiento (string).
 * @param {string} body.descripcionRequerimiento - Descripcion del requerimiento (string).
 * @param {boolean} body.requerimientoObligatorio - Si el requerimiento es obligatorio (boolean).
 * @param {number} body.brokerId - ID del broker que agrega el requisito (numero).
 * @returns Retorna: confirmacion de creacion del requisito o error.
 */
router.post('/:policyId/requirements', async (req: Request, res: Response) => {
  const { policyId } = req.params;
  const { tipoRequerimiento, descripcionRequerimiento, requerimientoObligatorio, brokerId } = req.body;
  
  try {
    const connection = await getConnection();
    // TODO: Call tx_agregar_requisito_poliza stored procedure
    await connection.end();
    
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Actualizar requisito existente de una poliza.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza (numero).
 * @param {number} params.requirementId - ID del requisito (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.tipoRequerimiento - Nuevo tipo de requerimiento (string).
 * @param {string} body.descripcionRequerimiento - Nueva descripcion del requerimiento (string).
 * @param {boolean} body.requerimientoObligatorio - Si el requerimiento es obligatorio (boolean).
 * @param {number} body.brokerId - ID del broker que actualiza el requisito (numero).
 * @returns Retorna: confirmacion de actualizacion del requisito o error.
 */
router.put('/:policyId/requirements/:requirementId', async (req: Request, res: Response) => {
  const { policyId, requirementId } = req.params;
  const { tipoRequerimiento, descripcionRequerimiento, requerimientoObligatorio, brokerId } = req.body;
  
  try {
    const connection = await getConnection();
    // TODO: Call tx_actualizar_requisito_poliza stored procedure
    await connection.end();
    
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Eliminar requisito de una poliza.
 * @param {object} params - Parametros de la URL.
 * @param {number} params.policyId - ID de la poliza (numero).
 * @param {number} params.requirementId - ID del requisito a eliminar (numero).
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {number} body.brokerId - ID del broker que elimina el requisito (numero).
 * @returns Retorna: confirmacion de eliminacion del requisito o error.
 */
router.delete('/:policyId/requirements/:requirementId', async (req: Request, res: Response) => {
  const { policyId, requirementId } = req.params;
  const { brokerId } = req.body;
  
  try {
    const connection = await getConnection();
    // TODO: Call tx_eliminar_requisito_poliza stored procedure
    await connection.end();
    
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;