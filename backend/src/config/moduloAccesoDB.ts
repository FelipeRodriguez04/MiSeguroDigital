import mysql from 'mysql2/promise';

/*
* @author: Santiago Arellano
* @date: 18-Nov-2025
* @description: El presente archivo implementa las funciones claves para la conexion a la base de datos, permitiendo la creacion
* de un objeto de conexion usando el maquete mysql2 como el mecanismo de conexion. En este caso, mysql2 no es un driver
* especifico de tipo ODBC como se encontraria en otros lenguajes de programacion. Mysql2 es un mecanismo de comunicacion directa
* entre la base de datos y la aplicacion permitiendo por una comunicacion mas segura y con mayor compatibildiad con las funciones
* especificas de MySQL.
*/

const dbConfig = {
  host: process.env.DB_HOST || 'mysql_database',
  port: parseInt(process.env.DB_PORT || '34761'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2764',
  database: 'MiSeguroDigital'
};

/**
 * Funcion que implementa el mecanismo de obtener una conexion a la base de datos. EN este caso, el mecanismo de conexion
 * es intermitente, es decir este mecanimo no crea una conexion todo el tiempo estatic que se mantiene encendida con la
 * aplicacion, sino que crea una conexion cuando esta funcion sea usada, por lo que esto nos permite manejar conexiones
 * con menos carga en la db, y con un scope temporal.
 */
export const getConnection = async () => {
  return await mysql.createConnection(dbConfig);
};