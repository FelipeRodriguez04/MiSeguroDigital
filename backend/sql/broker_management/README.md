# Broker Management SQL Objects

Este directorio contiene las vistas y procedimientos almacenados para la gestión de brokers por parte de Global Admins.

## Views

### v_brokers_basic.sql
Vista principal para mostrar información consolidada de brokers activos. Une las tablas de registro, brokers, aseguradoras y roles.

**Campos incluidos:**
- Información personal del broker
- Estado del broker (pendiente, activo, rechazado)
- Información de la aseguradora asociada
- Rol asignado (si aplica)

### v_brokers_by_status.sql
Vista que agrupa brokers por estado para facilitar la revisión de solicitudes y gestión administrativa.

**Características:**
- Agrupación por estado del broker
- Priorización de solicitudes pendientes
- Información de roles asignados

## Stored Procedures

### tx_create_broker_manual.sql
Procedimiento para crear brokers manualmente por parte de Global Admins.

**Funcionalidades:**
- Validación de email único
- Validación de aseguradora existente
- Creación completa en tablas relacionadas
- Asignación de rol si el estado inicial es activo
- Registro de auditoría

**Códigos de resultado:**
- 200: Éxito
- 404: Aseguradora no encontrada
- 409: Email ya existe
- 500: Error interno

### tx_update_broker_manual.sql
Procedimiento para actualizar información de brokers existentes.

**Funcionalidades:**
- Actualización de campos de perfil
- Cambio de estado del broker
- Gestión automática de roles según estado
- Registro de valores anteriores y nuevos en auditoría

**Códigos de resultado:**
- 200: Éxito
- 404: Broker no encontrado
- 500: Error interno

### tx_delete_broker_manual.sql
Procedimiento para eliminación lógica (soft delete) de brokers.

**Funcionalidades:**
- Soft delete cambiando estado a inactivo
- Limpieza de roles asociados
- Registro de auditoría de eliminación

**Códigos de resultado:**
- 200: Éxito
- 404: Broker no encontrado
- 500: Error interno

### tx_approve_reject_broker.sql
Procedimiento especializado para aprobar o rechazar solicitudes de broker.

**Funcionalidades:**
- Cambio de estado de pendiente a activo/rechazado
- Asignación automática de rol inicial si es aprobado
- Validación de estado pendiente
- Registro de decisión en auditoría

**Códigos de resultado:**
- 200: Éxito
- 404: Broker no encontrado
- 409: Broker no está en estado pendiente
- 500: Error interno

## Uso

Estos objetos SQL están diseñados para ser utilizados por la API backend para operaciones CRUD de brokers por parte de administradores globales. Incluyen validaciones específicas para el flujo de aprobación de brokers y gestión de roles.

## Notas de Implementación

- Todos los procedimientos usan transacciones para garantizar consistencia
- Se implementa soft delete para preservar integridad referencial
- La gestión de roles es automática según el estado del broker
- Los códigos de error están estandarizados
- Se incluye auditoría completa de todas las operaciones