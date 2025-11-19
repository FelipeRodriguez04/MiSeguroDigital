# Poliza Management SQL Objects

Este directorio contiene las vistas y procedimientos almacenados para la gestión de pólizas por parte de Admin Brokers y consulta por Analistas.

## Views

### v_polizas_basic.sql
Vista principal para mostrar información consolidada de pólizas. Accesible por Admin Brokers para gestión completa.

**Campos incluidos:**
- Información completa de la póliza
- Datos de la aseguradora asociada
- Estadísticas de aplicaciones (total, pendientes, aprobadas)

### v_polizas_by_aseguradora.sql
Vista que agrupa pólizas por aseguradora con métricas de rendimiento.

**Características:**
- Agrupación por aseguradora
- Métricas de popularidad
- Contadores de aplicaciones y registros activos

### v_polizas_analyst_readonly.sql
Vista de solo lectura para analistas de broker con información esencial y métricas.

**Características:**
- Solo pólizas activas y pausadas
- Campos no sensibles
- Métricas de análisis (tasas de aprobación, registros activos)
- Sin acceso a campos administrativos sensibles

## Stored Procedures

### tx_create_poliza.sql
Procedimiento para crear pólizas por parte de Admin Brokers.

**Funcionalidades:**
- Validación de aseguradora existente
- Creación completa de póliza
- Registro de auditoría con broker responsable
- Asignación de estado inicial

**Códigos de resultado:**
- 200: Éxito
- 404: Aseguradora no encontrada
- 500: Error interno

### tx_update_poliza.sql
Procedimiento para actualizar pólizas existentes.

**Funcionalidades:**
- Actualización de todos los campos de póliza
- Registro completo de valores anteriores y nuevos
- Validación de existencia de póliza
- Auditoría detallada de cambios

**Códigos de resultado:**
- 200: Éxito
- 404: Póliza no encontrada
- 500: Error interno

### tx_delete_poliza.sql
Procedimiento para eliminación lógica (soft delete) de pólizas.

**Funcionalidades:**
- Soft delete cambiando estado a 'despublicada'
- Validación de registros activos (no permite eliminar si hay usuarios activos)
- Registro de auditoría de eliminación
- Protección de integridad de datos

**Códigos de resultado:**
- 200: Éxito
- 404: Póliza no encontrada
- 409: Conflicto - tiene registros activos
- 500: Error interno

## Permisos por Rol

### Admin Broker
- **Crear**: tx_create_poliza
- **Leer**: v_polizas_basic, v_polizas_by_aseguradora
- **Actualizar**: tx_update_poliza
- **Eliminar**: tx_delete_poliza

### Analista
- **Leer**: v_polizas_analyst_readonly (solo lectura)
- Sin permisos de modificación

## Auditoría

Todas las operaciones de modificación (INSERT, UPDATE, DELETE) se registran en la tabla `RegistroAudit_Polizas` con:
- Operación realizada
- ID de la póliza afectada
- ID de la aseguradora
- Valores anteriores y nuevos (para UPDATE)
- ID del broker que realizó el cambio
- Timestamp de la modificación

## Notas de Implementación

- Todos los procedimientos usan transacciones para garantizar consistencia
- Se implementa soft delete para preservar integridad referencial
- Las vistas incluyen métricas calculadas para análisis de rendimiento
- Los analistas solo pueden ver pólizas activas y pausadas
- Se valida que no existan registros activos antes de eliminar pólizas
- Los códigos de error están estandarizados para facilitar el manejo en la API