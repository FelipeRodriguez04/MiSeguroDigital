# Policy Payment Management SQL Objects

Este directorio contiene los procedimientos almacenados para la gestion de pagos de polizas.

## Stored Procedures

### `tx_registrar_pago_poliza.sql`
Permite a un usuario registrar un pago para una poliza en la que tiene un registro activo. Se utiliza para registrar pagos de mensualidades o de cancelacion.

### `sp_obtener_pagos_usuario.sql`
Es un procedimiento que devuelve una tabla con el historial completo de pagos asociados a un registro de poliza de un usuario.
