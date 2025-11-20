-- =====================================================
-- DATOS ADICIONALES: APLICACIONES, REGISTROS, COMENTARIOS Y PAGOS
-- =====================================================

-- Insertar requerimientos por poliza (uno por poliza)
INSERT INTO Requerimientos_por_Poliza (id_poliza, tipo_requerimiento, descripcion_requerimiento, requerimiento_obligatorio) VALUES
(1, 'historial_crediticio', 'Historial crediticio de los ultimos 12 meses', 1),
(2, 'registros_medicos', 'Examenes medicos basicos y historial clinico', 1),
(3, 'prueba_de_residencia', 'Comprobante de domicilio actualizado', 1),
(4, 'estados_de_cuenta', 'Estados de cuenta bancarios de los ultimos 3 meses', 1),
(5, 'historial_crediticio', 'Reporte del buro de credito actualizado', 1);

-- Crear aplicaciones aprobadas (5 usuarios aplicando a diferentes polizas)
INSERT INTO AplicacionAPoliza (id_usuario, id_poliza, id_broker_que_reviso, fecha_de_aplicacion, estado_actual_aplicacion, razon_de_rechazo) VALUES
(3, 1, 2, '2024-10-15 10:30:00', 'aprobada', NULL),
(4, 3, 3, '2024-10-18 14:20:00', 'aprobada', NULL),
(5, 5, 4, '2024-10-22 09:15:00', 'aprobada', NULL),
(6, 7, 5, '2024-10-25 16:45:00', 'aprobada', NULL),
(7, 9, 6, '2024-10-28 11:30:00', 'aprobada', NULL);

-- Insertar documentos por aplicacion (uno por aplicacion)
INSERT INTO Documentos_por_AplicacionPoliza (id_de_usuario_carga, id_aplicacion_poliza, id_requerimiento_poliza, nombre_del_documento, fecha_de_carga) VALUES
(3, 1, 1, 'historial_crediticio_juan_perez.pdf', '2024-10-15 11:00:00'),
(4, 2, 3, 'comprobante_domicilio_maria_gonzalez.pdf', '2024-10-18 15:00:00'),
(5, 3, 5, 'reporte_credito_carlos_rodriguez.pdf', '2024-10-22 10:00:00'),
(6, 4, 1, 'historial_crediticio_ana_martinez.pdf', '2024-10-25 17:15:00'),
(7, 5, 1, 'historial_crediticio_luis_fernandez.pdf', '2024-10-28 12:00:00');

-- Crear registros de usuario en poliza (5 registros activos)
INSERT INTO RegistroDeUsuarioEnPoliza (id_poliza, id_usuario, id_aplicacion_a_poliza, fecha_inicio_registro, fecha_finalizacion_registro, poliza_con_autorenew, estado_de_registro) VALUES
(1, 3, 1, '2024-11-01', '2025-11-01', 0, 'registro_activo'),
(3, 4, 2, '2024-11-01', '2025-11-01', 1, 'registro_activo'),
(5, 5, 3, '2024-11-01', '2025-11-01', 0, 'registro_activo'),
(7, 6, 4, '2024-11-01', '2026-11-01', 1, 'registro_activo'),
(9, 7, 5, '2024-11-01', '2025-11-01', 0, 'registro_activo');

-- Insertar reviews de polizas
INSERT INTO ReviewsDePolizas (rating_del_usuario, contexto_review, tiene_hidden_fees, detalle_hidden_fees) VALUES
(4, 'Excelente servicio, muy rapida la atencion al cliente', 0, NULL),
(5, 'Muy satisfecho con la cobertura, recomiendo ampliamente', 1, 'Cobran comision adicional por tramites no mencionada inicialmente');

-- Conectar reviews con usuarios y polizas
INSERT INTO ReviewsDeUsuarios (id_review_poliza, id_usuario, id_poliza, fecha_creacion_review) VALUES
(1, 3, 1, '2024-11-15'),
(2, 4, 3, '2024-11-18');

-- Insertar pagos (2 pagos por cada usuario registrado = 10 pagos total)
INSERT INTO PagosPorPoliza (id_registro_poliza, cantidad_pago, metodo_de_pago, estado_del_pago, motivo_del_pago, fecha_de_pago) VALUES
-- Pagos de Juan Perez (registro 1)
(1, 85.50, 'tarjeta_credito', 'completado', 'pago_mensualidad', '2024-11-01 08:00:00'),
(1, 85.50, 'tarjeta_credito', 'completado', 'pago_mensualidad', '2024-12-01 08:00:00'),

-- Pagos de Maria Gonzalez (registro 2)
(2, 65.75, 'tarjeta_debito', 'completado', 'pago_mensualidad', '2024-11-01 09:30:00'),
(2, 65.75, 'tarjeta_debito', 'completado', 'pago_mensualidad', '2024-12-01 09:30:00'),

-- Pagos de Carlos Rodriguez (registro 3)
(3, 110.00, 'efectivo', 'completado', 'pago_mensualidad', '2024-11-01 14:15:00'),
(3, 110.00, 'efectivo', 'completado', 'pago_mensualidad', '2024-12-01 14:15:00'),

-- Pagos de Ana Martinez (registro 4)
(4, 92.80, 'tarjeta_credito', 'completado', 'pago_mensualidad', '2024-11-01 16:20:00'),
(4, 92.80, 'tarjeta_credito', 'completado', 'pago_mensualidad', '2024-12-01 16:20:00'),

-- Pagos de Luis Fernandez (registro 5)
(5, 42.30, 'cheque', 'completado', 'pago_mensualidad', '2024-11-01 10:45:00'),
(5, 42.30, 'cheque', 'completado', 'pago_mensualidad', '2024-12-01 10:45:00');