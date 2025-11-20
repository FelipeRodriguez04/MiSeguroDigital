# SQL Objects for MiSeguroDigital

This directory contains SQL views and stored procedures for the MiSeguroDigital platform.

## Views

### v_usuarios_basic.sql
Vista principal para mostrar información consolidada de usuarios activos. Une las tablas de registro, usuarios y roles para proporcionar una vista completa de cada usuario en el sistema.

**Campos incluidos:**
- Información personal del usuario
- Estado de actividad
- Rol asignado
- Información de broker (si aplica)

### v_usuarios_by_role.sql
Vista que agrupa usuarios por rol para facilitar la administración. Útil para reportes y gestión de usuarios por nivel de autorización.

**Características:**
- Agrupación por tipo de rol
- Ordenamiento jerárquico de roles
- Identificación de usuarios que también son brokers

## Stored Procedures

### tx_create_user_manual.sql
Procedimiento para crear usuarios manualmente por parte de Global Admins.

**Funcionalidades:**
- Validación de email único
- Creación completa en tablas relacionadas
- Registro de auditoría
- Manejo de errores con códigos de resultado

**Códigos de resultado:**
- 200: Éxito
- 409: Email ya existe
- 500: Error interno

### tx_update_user_manual.sql
Procedimiento para actualizar información de usuarios existentes.

**Funcionalidades:**
- Actualización de campos de perfil
- Modificación de roles
- Registro de valores anteriores y nuevos en auditoría
- Validación de existencia del usuario

**Códigos de resultado:**
- 200: Éxito
- 404: Usuario no encontrado
- 500: Error interno

### tx_delete_user_manual.sql
Procedimiento para eliminación lógica (soft delete) de usuarios.

**Funcionalidades:**
- Soft delete cambiando estado a inactivo
- Protección contra eliminación del último Global Admin
- Registro de auditoría de eliminación
- Validaciones de seguridad

**Códigos de resultado:**
- 200: Éxito
- 404: Usuario no encontrado
- 403: No se puede eliminar último admin
- 500: Error interno

## Uso

Estos objetos SQL están diseñados para ser utilizados por la API backend para operaciones CRUD de usuarios por parte de administradores globales. Todos los procedimientos incluyen manejo de errores y registro de auditoría para mantener la trazabilidad de las operaciones.

## Notas de Implementación

- Todos los procedimientos usan transacciones para garantizar consistencia
- Se implementa soft delete para preservar integridad referencial
- Los códigos de error están estandarizados para facilitar el manejo en la API
- Los comentarios están en español sin caracteres especiales para compatibilidad