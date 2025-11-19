# Análisis Comparativo y Sugerencias de Expansión para la API de MiSeguroDigital

## Resumen General y Recomendaciones Clave

Tras una revisión exhaustiva de los procedimientos y vistas SQL en comparación con los archivos de rutas de la API (`/src/routes/**`), se han identificado varias áreas clave donde la API puede expandirse para utilizar completamente la lógica de negocio ya definida en la base de datos.

La brecha más significativa es la **ausencia total de un módulo de API para la gestión de Brokers**. Además, existen operaciones CRUD y de consulta importantes que no han sido expuestas para la gestión de Usuarios y Pólizas.

**Recomendaciones de Alta Prioridad:**

1.  **Crear un nuevo archivo de rutas `src/routes/brokers.ts`** para implementar todos los endpoints CRUD para la gestión de brokers, una funcionalidad crítica que actualmente no tiene interfaz en la API.
2.  **Completar las operaciones CRUD en `src/routes/users.ts`**, añadiendo la funcionalidad para eliminar usuarios y permitir que un usuario actualice su propio perfil.
3.  **Desarrollar endpoints para la gestión de Requisitos de Pólizas** en `src/routes/policies.ts`, ya que toda esta lógica de negocio está ausente en la API.
4.  **Implementar un endpoint para formalizar el registro de un usuario a una póliza** después de que su aplicación sea aprobada, utilizando el procedure `tx_registrar_usuario_en_poliza.sql`.

---

## 1. Gestión de Brokers (Broker Management)

Esta es el área con la mayor brecha de implementación. A pesar de tener un conjunto completo de procedimientos y vistas en `sql/broker_management/`, **no existe un archivo de rutas correspondiente en `src/routes/`** que exponga esta funcionalidad.

### Estado Actual

-   **Rutas de API existentes:** Ninguna.
-   **Lógica SQL definida:** Completa (CRUD, aprobación/rechazo, vistas por estado).

### Procedimientos SQL no implementados

-   `tx_create_broker_manual.sql`: Falta un endpoint `POST /brokers` para que un Global Admin pueda crear un nuevo broker.
-   `tx_update_broker_manual.sql`: Falta un endpoint `PUT /brokers/:brokerId` para actualizar la información de un broker.
-   `tx_delete_broker_manual.sql`: Falta un endpoint `DELETE /brokers/:brokerId` para la eliminación lógica de un broker.
-   `tx_approve_reject_broker.sql`: Falta un endpoint `PUT /brokers/:brokerId/status` para que un Global Admin apruebe o rechace a un broker pendiente.
-   `sp_get_broker_data.sql`: Falta un endpoint `GET /brokers/:brokerId` para obtener el perfil detallado de un broker.

### Vistas SQL no implementadas

-   `v_brokers_basic.sql`: No hay un endpoint (ej. `GET /brokers`) para listar todos los brokers activos con su información consolidada, ideal para un panel de administración.
-   `v_brokers_by_status.sql`: No hay un endpoint (ej. `GET /brokers/by-status?status=pendiente`) para filtrar brokers por su estado.

### Sugerencias

-   **Crear un nuevo archivo `src/routes/brokers.ts`**.
-   Implementar todos los endpoints CRUD mencionados anteriormente, asegurando que estén protegidos y solo sean accesibles por usuarios con rol de `global_admin` o `global_superadmin`.
-   Crear endpoints de consulta que utilicen las vistas `v_brokers_basic.sql` y `v_brokers_by_status.sql` para poblar los dashboards de administración.

---

## 2. Gestión de Usuarios (User Management)

La gestión de usuarios está parcialmente implementada, pero faltan operaciones CRUD clave y rutas para aprovechar las vistas existentes.

### Estado Actual

-   `users.ts` y `auth.ts` cubren el inicio de sesión, el registro de usuarios (desde signup y admin) y la actualización de usuarios (solo por admin).

### Gaps y Sugerencias

1.  **Eliminación de Usuarios:**
    -   **Lógica SQL:** `tx_delete_user_manual.sql` (`eliminarUnUsuarioAdminOnlyManual`) ya existe.
    -   **Sugerencia:** Implementar un endpoint `DELETE /users/:userId` en `users.ts` que llame a este procedimiento. Debe ser una ruta protegida para administradores.

2.  **Actualización de Perfil por el Propio Usuario:**
    -   **Lógica SQL:** El procedure `tx_update_user_manual.sql` (`actualizarUnUsuarioDesdeAdminOUsuario`) ya contempla un parámetro `comingFrom` que diferencia entre una actualización hecha por un 'admin' o por un 'user'.
    -   **Sugerencia:** Crear un nuevo endpoint `PUT /users/my-profile` en `users.ts` que permita a un usuario autenticado actualizar su propia información. Este endpoint llamaría al mismo procedure pero con `comingFrom = 'user'`.

3.  **Consulta de Usuarios por Rol:**
    -   **Lógica SQL:** La vista `v_usuarios_by_role.sql` ya está definida.
    -   **Sugerencia:** Añadir un endpoint `GET /users/by-role` en `users.ts` para administradores. Esto permitiría, por ejemplo, listar a todos los `global_admin` del sistema.

4.  **Obtener Datos de Usuario:**
    -   **Lógica SQL:** `sp_get_user_data.sql` (`getUserDataByUserID`) existe.
    -   **Sugerencia:** El endpoint actual `GET /perfil/:userId` usa la vista `usuarios_basico_view`. Se podría evaluar si el Stored Procedure `getUserDataByUserID` ofrece información más rica que justifique su uso o la creación de un endpoint de "detalles" adicional.

---

## 3. Gestión de Pólizas (Policy Management)

Aunque `policies.ts` es el archivo de rutas más completo, aún hay funcionalidades importantes sin implementar, especialmente en lo que respecta a los requisitos de las pólizas y los endpoints específicos para los roles de broker.

### Estado Actual

-   Se cubren las operaciones CRUD básicas para pólizas y la búsqueda.
-   Existe un endpoint para que los analistas vean un dashboard (`GET /analisis/solo-lectura`).

### Gaps y Sugerencias

#### **Gestión de Requisitos de Pólizas (Brecha Crítica)**

Toda la lógica para manejar los requisitos de una póliza está definida en SQL pero no en la API.

-   **Lógica SQL:**
    -   `tx_agregar_requisito_poliza.sql`
    -   `tx_actualizar_requisito_poliza.sql`
    -   `tx_eliminar_requisito_poliza.sql`
    -   `v_poliza_requisitos.sql`
-   **Sugerencia:** Crear un conjunto de endpoints anidados bajo las pólizas en `policies.ts`:
    -   `POST /policies/:policyId/requirements`: Para agregar un nuevo requisito.
    -   `PUT /policies/:policyId/requirements/:requirementId`: Para actualizar un requisito existente.
    -   `DELETE /policies/:policyId/requirements/:requirementId`: Para eliminar un requisito.
    -   `GET /policies/:policyId/requirements`: Para listar todos los requisitos de una póliza usando la vista `v_poliza_requisitos`.

#### **Endpoints para Admin-Brokers y Analistas**

Los endpoints actuales no distinguen claramente entre los diferentes roles de broker.

-   **Lógica SQL:** Las vistas `v_polizas_basic`, `v_polizas_by_aseguradora` y `v_polizas_analyst_readonly` están diseñadas para diferentes niveles de acceso.
-   **Sugerencia:**
    -   Crear un endpoint `GET /policies/admin/dashboard` para **Admin Brokers** que utilice la vista `v_polizas_basic.sql` y `v_polizas_by_aseguradora.sql` para obtener una visión completa y métricas de rendimiento.
    -   Renombrar `GET /analisis/solo-lectura` a algo más claro como `GET /policies/analyst/dashboard` para que su propósito (servir datos a la vista `v_polizas_analyst_readonly`) sea más evidente.
    -   El endpoint `GET /broker/:brokerId` es útil, pero debería ser complementado con vistas de dashboard más amplias.

---

## 4. Gestión de Aplicaciones (Application Management)

El flujo de aplicaciones está mayormente implementado, pero falta un paso crucial y una funcionalidad de consulta detallada.

### Estado Actual

-   Se permite crear aplicaciones, ver las aplicaciones de un usuario y las pendientes para un broker.
-   Se permite a un analista aprobar o rechazar una aplicación.

### Gaps y Sugerencias

1.  **Formalizar Registro Post-Aprobación:**
    -   **Lógica SQL:** El procedure `tx_registrar_usuario_en_poliza.sql` existe para registrar formalmente a un usuario en una póliza una vez que su aplicación es 'aprobada'. Este es un paso crítico que activa el registro, permitiendo pagos y comentarios.
    -   **Sugerencia:** Crear un endpoint `POST /applications/:applicationId/register` en `applications.ts`. Este endpoint debería ser invocado por un admin/broker después de la aprobación para formalizar la póliza del usuario.

2.  **Obtener Detalles de una Aplicación:**
    -   **Lógica SQL:** La vista `v_aplicacion_detalles.sql` (`viewDetallesDeAplicacionPorUsuarios`) ofrece una visión completa de una aplicación, incluyendo datos del usuario y de la póliza.
    -   **Sugerencia:** Implementar un endpoint `GET /applications/:applicationId/details` en `applications.ts`. Esto sería útil tanto para el usuario que quiere ver los detalles de su solicitud como para el analista que la está revisando.

## Conclusión

La base de datos está bien estructurada y contiene una lógica de negocio robusta y granular. El siguiente paso natural es construir la capa de API que falta para exponer estas funcionalidades de manera segura y eficiente. Enfocarse en las brechas mencionadas, comenzando por la **gestión de brokers**, desbloqueará capacidades administrativas fundamentales para la plataforma.
