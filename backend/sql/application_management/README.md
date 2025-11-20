# Application Management SQL Objects

Este directorio contiene las vistas y procedimientos almacenados para la gestion de solicitudes de polizas (aplicaciones).

## Vistas

### `v_usuario_aplicaciones.sql`
Muestra el historial de solicitudes de un usuario especifico, permitiendole rastrear el estado de sus aplicaciones.

### `v_broker_aplicaciones_pendientes.sql`
Vista para los analistas de broker, mostrando la cola de solicitudes pendientes que pertenecen a su aseguradora.

### `v_broker_reportes_stats.sql`
Agrega datos y calcula estadisticas sobre las solicitudes para la generacion de reportes.

### `v_aplicacion_detalles.sql`
Proporciona una vista detallada de una solicitud individual, incluyendo informacion del aplicante, la poliza y los documentos asociados.

## Stored Procedures

### `tx_crear_aplicacion.sql`
Permite a un usuario crear una nueva solicitud para una poliza. La solicitud se crea en estado `pendiente_procesar`.

### `tx_procesar_aplicacion.sql`
Permite a un analista aprobar o rechazar una solicitud, cambiando su estado y registrando la decision en una tabla de auditoria.
