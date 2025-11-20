/**
 * @author: Santiago Arellano
 * @date: 18-Nov-2025
 * @description: El presente archivo implementa las funciones claves para el manejo de la
 * encriptacion de contrasenas hacia la base de datos. En este caso se implementa un mecanismo de generacion
 * de salting en base a 32 random bytes, similar a un mecanimso que he usado en Java para guardar contrasenas.
 *
 * El segundo paso es la encriptacion de la contrasena completa con SHA256 usando tanto la contrasena
 * como el salt generado.
 */
import crypto from 'crypto';

export const generateSalt = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashPassword = (password: string, salt: string): string => {
  return crypto
      .createHash('sha256') /*1. Inicializamos el objeto para hasheo en base al algoritmo sha256*/
      .update(password + salt) /*2. Enviamos la data para la configuracion innicial del objeto para el hashing. La idea es que
      en este casovamos a pasar un astring, y por tanto confgiguramos el objeto con un encoding the utf8 y con
      un tipo de dato string como la entrada*/
      .digest('hex'); /*3. Finalmente generamos el hash en base al algoritmo sha256 y retornamos el resultado en formato hexadecimal, en este caso,
      el objeto a ese punto termina de ser util por tanto luego de digerir la informacion y encriptarla la retornamos
      inmediatamente.*/
};