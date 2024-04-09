import bcrypt from 'bcryptjs';
import { generarJWT } from '~/helpers/jwt';
import {
	insertarEstudianteExterno,
	insertarProfesorExterno,
	insertarSocioComunitario,
	obtenerUsuarioSinRolPorEmail
} from '../../utils/database/services/daos/daoUsuario';
import type { EstudianteExterno } from '../../utils/database/services/types/EstudianteExterno';
import type { ProfesorExterno } from '../../utils/database/services/types/ProfesorExterno';
import type { SocioComunitario } from '../../utils/database/services/types/SocioComunitario';

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
		let fecha = new Date().toLocaleDateString();
		switch (rol) {
			case 'ROL_SOCIO_COMUNITARIO':
				let socioComunitario: SocioComunitario = {
					id: null,
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
					createdAt: fecha as unknown as Date, //Que formato queremos de fechas? Cambiar tipado a string en vez de date?
					updatedAt: fecha as unknown as Date,
					terminos_aceptados: body.terminos_aceptados,
					rol: 'SOCIO_COMUNITARIO'
				};
				let idSocio = await insertarSocioComunitario(socioComunitario);

				if (idSocio === -1) {
					throw createError({ statusCode: 400, statusMessage: 'Ha ocurrido un error al crear el socio' });
				}

				usuarioCreado = socioComunitario;
				usuarioCreado.id = idSocio;
				break;
			case 'ROL_ESTUDIANTE':
				let estudiante: EstudianteExterno = {
					id: null,
					correo: email,
					nombre: body.nombre,
					apellidos: body.apellidos,
					password: passwordNew,
					telefono: body.telefono,
					origin_login: 'Portal APS',
					origin_img: 'imagen', //Esta correcto?
					createdAt: fecha as unknown as Date, //Que formato queremos de fechas? Cambiar tipado a string en vez de date?
					updatedAt: fecha as unknown as Date,
					terminos_aceptados: body.terminos_aceptados,
					rol: 'SOCIO_COMUNITARIO',
					titulacion: body.titulacion,
					nombreUniversidad: body.universidad
				};
				let idEstu = await insertarEstudianteExterno(estudiante);

				if (idEstu === -1) {
					throw createError({ statusCode: 400, statusMessage: 'Ha ocurrido un error al crear el estudiante' });
				}

				usuarioCreado = estudiante;
				usuarioCreado.id = idEstu;
				break;
			case 'ROL_PROFESOR':
				let profesor: ProfesorExterno = {
					id: null,
					correo: email,
					nombre: body.nombre,
					apellidos: body.apellidos,
					password: passwordNew,
					telefono: body.telefono,
					origin_login: 'Portal APS',
					origin_img: 'imagen', //Esta correcto?
					createdAt: fecha as unknown as Date, //Que formato queremos de fechas? Cambiar tipado a string en vez de date?
					updatedAt: fecha as unknown as Date,
					terminos_aceptados: body.terminos_aceptados,
					rol: 'SOCIO_COMUNITARIO',
					universidad: body.universidad,
					facultad: body.facultad,
					area_conocimiento: body.areaconocimiento_profesor
				};
				let idProfe = await insertarProfesorExterno(estudiante);

				if (idProfe === -1) {
					throw createError({ statusCode: 400, statusMessage: 'Ha ocurrido un error al crear el profesor' });
				}

				usuarioCreado = profesor;
				usuarioCreado.id = idProfe;

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
