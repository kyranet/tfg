import bcrypt from 'bcryptjs';
import { generarJWT } from '~/helpers/jwt';
import {
	insertarEstudianteExterno,
	insertarProfesorExterno,
	insertarSocioComunitario,
	obtenerUsuarioSinRolPorEmail
} from '../../utils/database/services/daos/daoUsuario';

export default eventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { email, password, rol } = body;

		// Comprueba si el correo ya está registrado
		let existeEmail = await obtenerUsuarioSinRolPorEmail(email);
		if (existeEmail) {
			throw createError({ statusCode: 400, statusMessage: 'El correo ya está registrado' });
		}

		let passwordNew = bcrypt.hashSync(password, bcrypt.genSaltSync());
		let usuarioCreado;
		let token;
		switch (rol) {
			case 'ROL_SOCIO_COMUNITARIO':
				usuarioCreado = await insertarSocioComunitario({
					correo: email,
					nombre: body.nombre,
					apellidos: body.apellidos,
					password: passwordNew,
					sector: body.sector,
					nombre_socioComunitario: body.nombre_socioComunitario,
					telefono: body.telefono,
					url: body.url,
					mision: body.mision,
					origin_login: 'Portal APS',
					origin_img: 'imagen', //Esta correcto?
					terminos_aceptados: body.terminos_aceptados
				});
				break;
			case 'ROL_ESTUDIANTE':
				usuarioCreado = await insertarEstudianteExterno({
					correo: email,
					nombre: body.nombre,
					apellidos: body.apellidos,
					password: passwordNew,
					telefono: body.telefono,
					origin_login: 'Portal APS',
					origin_img: 'imagen', //Esta correcto?
					terminos_aceptados: body.terminos_aceptados,
					titulacion: body.titulacion,
					universidad: body.universidad
				});
				break;
			case 'ROL_PROFESOR':
				usuarioCreado = await insertarProfesorExterno({
					correo: email,
					nombre: body.nombre,
					apellidos: body.apellidos,
					password: passwordNew,
					telefono: body.telefono,
					origin_login: 'Portal APS',
					origin_img: 'imagen', //Esta correcto?
					terminos_aceptados: body.terminos_aceptados,
					universidad: body.universidad,
					facultad: body.facultad,
					areasConocimiento: body.areaconocimiento_profesor
				});
				break;
			default:
				throw createError({ statusCode: 400, statusMessage: 'Rol no válido' });
		}

		// Pasamos el usuario creaod dentro de los switch y evitamos duplicar codigo
		token = await generarJWT({ uid: usuarioCreado.id, ...body });

		return { ok: true, usuario: usuarioCreado, token };
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
	}
});
