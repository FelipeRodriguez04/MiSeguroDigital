# Policy Comment Management SQL Objects

Este directorio contiene los procedimientos almacenados para gestionar los comentarios y reviews de las polizas por parte de los usuarios y administradores.

## Stored Procedures

### `tx_crear_comentario_poliza.sql`
Permite a un usuario que tiene un registro activo en una poliza anadir un nuevo comentario o review sobre esa poliza.

### `tx_editar_comentario_usuario.sql`
Permite a un usuario modificar un comentario que haya creado previamente. La transaccion valida que el usuario sea el autor original.

### `tx_admin_eliminar_comentario.sql`
Permite a un administrador eliminar cualquier comentario de la plataforma. Realiza un borrado fisico del registro.

### `sp_obtener_comentarios_poliza.sql`
Es un procedimiento que devuelve una tabla con todos los comentarios asociados a una poliza especifica, incluyendo informacion del autor.
