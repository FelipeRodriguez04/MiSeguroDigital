import { Router, Request, Response } from 'express';
import { getConnection } from '../config/moduloAccesoDB';
import { generateSalt, hashPassword } from '../config/moduloAutenticacionSimple';

/*
* @author: Santiago Arellano
* @date: 18-Noviembre-2025
* @description: El presente archivo implementa todas las rutas necesarias en el path general /auth para el manejo
* de los usuarios
*/


const router = Router();

/**
 * @description Iniciar sesion de usuario.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.email - Correo electronico del usuario (string).
 * @param {string} body.password - Contrasena del usuario (string).
 * @returns Retorna: datos del usuario autenticado o error de credenciales.
 */
router.post('/iniciar-sesion', async (req: Request, res: Response) => {
  const { email, password } = req.body;

	//? 1. Validamos que las entradas no se encuentren vacias
	if (!email || !password) {
		res.status(400).json({
			success: false,
			message: 'Error code 0x001 - [Raised] No se han registrado alguno de los campos' +
				'para este endpoint',
			offender: (!email) ? 'email' : 'password'
		});
	}

  
  try {
    const connection = await getConnection();
    
    await connection.execute('CALL obtenerSaltUsuario(?, @codigoResultado, @passwordSalt)', [email]);
    const [saltResult] = await connection.execute('SELECT @codigoResultado as codigo, @passwordSalt as salt');
    const { codigo: saltCodigo, salt } = Array.isArray(saltResult) && saltResult[0] ? saltResult[0] as any : { codigo: 404, salt: null };
    
    if (saltCodigo !== 200) {
      await connection.end();
      return res.status(401).json({ success: false, message: 'Credenciales invalidas' });
    }
    
    const hashedPassword = hashPassword(password, salt);



    await
			connection.execute(
				'CALL loginUsuario(?, ?, @codigoResultado, @usuarioData)',
							[email, hashedPassword]);
    const [loginResult] = await
			connection.execute('SELECT @codigoResultado as codigo, @usuarioData as userData');
    const { codigo, userData } = Array.isArray(loginResult) && loginResult[0] ? loginResult[0] as any : { codigo: 401, userData: null };
    
    await connection.end();
    
    if (codigo === 200) {
      res.json({ success: true, user: JSON.parse(userData) });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales invalidas' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Registrar nuevo usuario regular.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.email - Correo electronico del usuario (string).
 * @param {string} body.password - Contrasena del usuario (string).
 * @param {string} body.nombrePrim - Primer nombre del usuario (string).
 * @param {string} body.apellidoPrim - Primer apellido del usuario (string).
 * @param {string} body.fullNombre - Nombre completo del usuario (string).
 * @param {string} body.telefono - Telefono del usuario (string).
 * @param {string} body.fechaNacimiento - Fecha de nacimiento del usuario (string).
 * @returns Retorna: ID del usuario creado o error de registro.
 */
router.post('/usuarios/registrar-usuario', async (req: Request, res: Response) => {
  const { email, password, nombrePrim, apellidoPrim, fullNombre, telefono, fechaNacimiento } = req.body;

	//? 1. Validamos que todas las entradas esten presentes, y reportamos el offender
	if (!email || !password || !nombrePrim || !apellidoPrim || !fullNombre || !telefono || !fechaNacimiento) {
		res.status(400).json({
			success: false,
			message: 'Error code 0x001 - [Raised] No se han registrado alguno de los campos' +
				'para este endpoint',
			offender: (!email) ? 'email' : (!password) ? 'password' :
				(!nombrePrim) ? 'nombrePrim' :
					(!apellidoPrim) ? 'apellidoPrim' :
						(!fullNombre) ? 'fullNombre' :
							(!telefono) ? 'telefono' : 'fechaNacimiento'
		});
	}

	//? 2. Continuamos con el proceso regular
  try {
    const connection = await getConnection();

		//? 2.1 Generamos un salt y el hashing en base al algoritmo de la aplicacion, esto permite registrar
		//? y que el logging sea mas facil para los usuairios ya creados.
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    
    await connection.execute(
      'CALL crearUsuarioManualDesdeAdminOSignUp(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @codigoResultado, @nuevoUsuarioId)',
      [email, hashedPassword, salt, nombrePrim, apellidoPrim, fullNombre, telefono, fechaNacimiento, 'global_user', null, 'signup']
    );
    
    const [resultadoRegistroUsuarioNormal] =
			await connection.execute(
				'SELECT @codigoResultado as codigo, @nuevoUsuarioId as usuarioId');
    await connection.end();
    
    const { codigo, usuarioId } =
			Array.isArray(resultadoRegistroUsuarioNormal) && resultadoRegistroUsuarioNormal[0] ?
				resultadoRegistroUsuarioNormal[0] as any : { codigo: 500, usuarioId: null };

		//? 2.2 Al final retornamos solo la data del codigo de la consulta y el id del usuario creado, no
		//? es necesario retornar el objeto creado completo porque esto es otro paso.
    if (codigo === 200) {
      res.json({ success: true, usuarioId, message: 'Usuario creado correctamente' });
    } else if (codigo === 409) {
      res.status(409).json({ success: false, message: 'El correo ya esta registrado' });
    } else {
      res.status(400).json({ success: false, message: 'Error al crear usuario' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * @description Registrar nuevo usuario desde panel de administracion. Este metodo se diferencia del
 * /usuarios/registrar-usuarios ya que peremite crear usaurios con roles variados como global_superadmin, o
 * global_admin, no solo global_user como es el de arriba.
 * @param {object} body - Parametros del cuerpo de la peticion.
 * @param {string} body.email - Correo electronico del nuevo usuario (string).
 * @param {string} body.password - Contrasena del nuevo usuario (string).
 * @param {string} body.nombrePrim - Primer nombre del nuevo usuario (string).
 * @param {string} body.apellidoPrim - Primer apellido del nuevo usuario (string).
 * @param {string} body.fullNombre - Nombre completo del nuevo usuario (string).
 * @param {string} body.telefono - Telefono del nuevo usuario (string).
 * @param {string} body.fechaNacimiento - Fecha de nacimiento del nuevo usuario (string).
 * @param {string} body.rolUsuario - Rol del nuevo usuario (string).
 * @param {number} body.adminId - ID del administrador que registra al usuario (numero).
 * @returns Retorna: ID del usuario creado o error de registro.
 */
router.post('/admins/registrar-usuario', async (req: Request, res: Response) => {
  const { email, password,
		nombrePrim, apellidoPrim,
		fullNombre, telefono,
		fechaNacimiento, rolUsuario, adminId } = req.body;


	//? 1. Validamos que todos los datos esten presentes, y reportamos el offender
	if (!email || !password || !nombrePrim || !apellidoPrim || !fullNombre
		|| !telefono || !fechaNacimiento || !rolUsuario || !adminId) {
		res.status(400).json(
			{
				success: false,
				message: 'Error code 0x001 - [Raised] No se han registrado alguno de los campos' +
					'para este endpoint',
				offender: (!email) ? 'email' : (!password) ? 'password' :
					(!nombrePrim) ? 'nombrePrim' :
						(!apellidoPrim) ? 'apellidoPrim' :
							(!fullNombre) ? 'fullNombre' :
								(!telefono) ? 'telefono' : (!fechaNacimiento) ? 'fechaNacimiento' :
									(!rolUsuario) ? 'rolUsuario' : 'adminId'
			}
		)
	}

	//? 2. Continuamos con el proceso regular
  try {
    const connection = await getConnection();
    
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    
    await connection.execute(
      'CALL crearUsuarioManualDesdeAdminOSignUp(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @codigoResultado, @nuevoUsuarioId)',
      [email, hashedPassword, salt, nombrePrim, apellidoPrim,
				fullNombre, telefono, fechaNacimiento, rolUsuario, adminId, 'admin']
    );
    
    const [resultadoRegistroPorAdminPanel] = await connection.execute('SELECT @codigoResultado as codigo, @nuevoUsuarioId as usuarioId');
    await connection.end();
    
    const { codigo, usuarioId } = Array.isArray(resultadoRegistroPorAdminPanel) && resultadoRegistroPorAdminPanel[0] ? resultadoRegistroPorAdminPanel[0] as any : { codigo: 500, usuarioId: null };
    
    if (codigo === 200) {
      res.json({ success: true, usuarioId, message: 'Usuario creado correctamente' });
    } else if (codigo === 409) {
      res.status(409).json({ success: false, message: 'El correo ya esta registrado' });
    } else {
      res.status(400).json({ success: false, message: 'Error al crear usuario' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;