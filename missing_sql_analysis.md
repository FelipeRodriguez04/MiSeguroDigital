# Reporte de Vistas y Transacciones Faltantes en el Backend

Este documento detalla los objetos SQL (vistas y transacciones) que faltan por implementar en el backend para satisfacer los requerimientos de las rutas y componentes del frontend.

## 1. Funcionalidades para Usuarios (`/usuario`, `/catalog`, `/me/applications`)

El frontend define varias rutas para el usuario final que no tienen un respaldo completo en la base de datos actual.

### Vistas Faltantes

- **`v_polizas_catalogo.sql`**
  - **Ruta:** `/catalog`
  - **Propósito:** Vista optimizada para el catálogo público de pólizas. Debería mostrar solo la información relevante para el usuario final (nombre, descripción, costo, tipo, aseguradora) y excluir datos internos o administrativos.
  - **Justificación:** Aunque `v_polizas_basic` existe, una vista dedicada al catálogo asegura que solo se exponga la información necesaria y permite optimizar la consulta para el acceso público.

- **`v_usuario_aplicaciones.sql`**
  - **Ruta:** `/me/applications`
  - **Propósito:** Mostrar el historial de solicitudes de un usuario específico, incluyendo el nombre de la póliza, la fecha de solicitud y el estado actual de la aplicación (`pendiente`, `aprobada`, `rechazada`).
  - **Justificación:** El componente `user_applications.jsx` actualmente usa datos mock. Esta vista es crucial para que los usuarios puedan rastrear sus solicitudes.

### Transacciones Faltantes

- **`tx_crear_aplicacion.sql`**
  - **Ruta:** `/me/apply/:id_poliza` (implícita desde el catálogo)
  - **Propósito:** Procedimiento para que un usuario pueda iniciar una solicitud para una póliza específica. Debe registrar la aplicación en un estado inicial (`pendiente_procesar`) y asociarla al usuario y a la póliza.
  - **Justificación:** Es el punto de partida del flujo de negocio principal. Sin esta transacción, los usuarios no pueden solicitar pólizas.

## 2. Funcionalidades para Analistas de Broker (`/analista`, `/broker/applications`, `/broker/reports`)

El analista es responsable de revisar y procesar las solicitudes. Faltan los siguientes objetos para soportar sus tareas.

### Vistas Faltantes

- **`v_broker_aplicaciones_pendientes.sql`**
  - **Ruta:** `/broker/applications`
  - **Propósito:** Vista para que los analistas vean todas las solicitudes pendientes asociadas a las pólizas de su aseguradora. Debe incluir información del usuario solicitante, la póliza y la fecha.
  - **Justificación:** El componente `broker_applications.jsx` necesita esta vista para mostrar la cola de trabajo del analista.

- **`v_broker_reportes_stats.sql`**
  - **Ruta:** `/broker/reports`
  - **Propósito:** Vista que calcula y agrega estadísticas sobre las solicitudes, como el total de aprobadas, rechazadas y pendientes. Puede agrupar por póliza o por analista.
  - **Justificación:** El componente `broker_reports.jsx` depende de estos datos para mostrar un resumen del rendimiento.

- **`v_aplicacion_detalles.sql`**
  - **Ruta:** `/broker/reviews` (ruta planeada sin componente aún)
  - **Propósito:** Vista detallada de una sola aplicación, incluyendo todos los datos del usuario, la póliza y, fundamentalmente, los documentos o requisitos subidos por el usuario.
  - **Justificación:** Para que un analista pueda tomar una decisión informada, necesita acceso a toda la información de la solicitud en un solo lugar.

### Transacciones Faltantes

- **`tx_procesar_aplicacion.sql`**
  - **Ruta:** `/broker/applications` (acciones de aprobar/rechazar)
  - **Propósito:** Transacción para que un analista apruebe o rechace una solicitud. Debe cambiar el estado de la aplicación y registrar quién tomó la decisión y cuándo.
  - **Justificación:** Es la acción principal que realiza el analista y es fundamental para el flujo de negocio.

## 3. Funcionalidades para Administradores de Broker (`/admin`)

El administrador del broker tiene funcionalidades adicionales para gestionar la configuración de las pólizas que no están implementadas.

### Vistas Faltantes

- **`v_poliza_requisitos.sql`**
  - **Ruta:** `/broker/requirements` (ruta planeada sin componente aún)
  - **Propósito:** Vista que lista todos los requisitos asociados a cada póliza.
  - **Justificación:** Necesaria para la interfaz de gestión de requisitos.

- **`v_poliza_versiones.sql`**
  - **Ruta:** `/broker/versions` (ruta planeada sin componente aún)
  - **Propósito:** Vista que muestra el historial de versiones de una póliza, permitiendo comparar cambios a lo largo del tiempo.
  - **Justificación:** Clave para la funcionalidad de versionamiento de pólizas.

### Transacciones Faltantes

- **Gestión de Requisitos (`/broker/requirements`):**
  - **`tx_agregar_requisito_poliza.sql`**: Para añadir un nuevo requisito a una póliza.
  - **`tx_actualizar_requisito_poliza.sql`**: Para modificar un requisito existente.
  - **`tx_eliminar_requisito_poliza.sql`**: Para desvincular un requisito de una póliza.
  - **Justificación:** Este conjunto de transacciones es indispensable para que los administradores puedan definir qué documentos o datos son necesarios para cada póliza.

- **Gestión de Versiones (`/broker/versions`):**
  - **`tx_crear_version_poliza.sql`**: Transacción para crear una nueva versión de una póliza existente, probablemente archivando la anterior.
  - **Justificación:** Permite a los administradores actualizar las condiciones de una póliza sin perder el historial de las versiones anteriores.
