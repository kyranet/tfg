import bcrypt from 'bcryptjs';
import { z } from 'zod';
import {
	insertarEstudianteExterno,
	insertarProfesorExterno,
	insertarSocioComunitario,
	maybeGetUsuarioSinRolPorEmail
} from '../../utils/database/services/daos/daoUsuario';

const originLogin = 'Portal APS';
// TODO: This needs to be an ID to an image from the database:
const originImg = 'imagen';

const schemaBodyProfessor = z.object({
	role: z.literal('InternalProfessor'),
	university: z.string().trim(),
	faculty: z.string().trim(),
	knowledgeAreas: z.number().int().array()
});
const schemaBodyStudent = z.object({
	role: z.literal('InternalStudent'),
	university: z.string().trim(),
	degree: z.string().trim()
});
const schemaBodyCommunityPartner = z.object({
	role: z.literal('CommunityPartner'),
	sector: z.string().trim(),
	name: z.string().trim(),
	url: z.string().trim(),
	mission: z.string().trim()
});

const schemaBody = z.object({
	email: z.string().trim().email(),
	password: z.string().trim().min(6).max(100),
	firstName: z.string().trim().min(2).max(100),
	lastName: z.string().trim().min(2).max(100),
	phone: z.number().int(),
	acceptedTerms: z.boolean(),
	data: z.union([schemaBodyProfessor, schemaBodyStudent, schemaBodyCommunityPartner])
});
export default eventHandler(async (event) => {
	const session = await useAuthSession(event);
	if (session.data.id) {
		throw createError({ message: 'No puedes registrarte mientras estés conectado', statusCode: 403 });
	}

	const body = await readValidatedBody(event, schemaBody.parse);

	// Comprueba si el correo ya está registrado
	let existeEmail = await maybeGetUsuarioSinRolPorEmail(body.email);
	if (existeEmail) {
		throw createError({ statusCode: 400, statusMessage: 'El correo ya está registrado' });
	}

	const password = await bcrypt.hash(body.password, await bcrypt.genSalt());
	let user;
	switch (body.data.role) {
		case 'InternalProfessor':
			user = await insertarProfesorExterno({
				correo: body.email,
				nombre: body.firstName,
				apellidos: body.lastName,
				telefono: body.phone,
				password,
				origin_login: originLogin,
				origin_img: originImg,
				terminos_aceptados: body.acceptedTerms,
				universidad: body.data.university,
				facultad: body.data.faculty,
				areasConocimiento: body.data.knowledgeAreas
			});
			break;
		case 'InternalStudent':
			user = await insertarEstudianteExterno({
				correo: body.email,
				nombre: body.firstName,
				apellidos: body.lastName,
				telefono: body.phone,
				password,
				origin_login: originLogin,
				origin_img: originImg,
				terminos_aceptados: body.acceptedTerms,
				titulacion: body.data.degree,
				universidad: body.data.university
			});
			break;
		case 'CommunityPartner':
			user = await insertarSocioComunitario({
				correo: body.email,
				nombre: body.firstName,
				apellidos: body.lastName,
				telefono: body.phone,
				password,
				origin_login: originLogin,
				origin_img: originImg,
				terminos_aceptados: body.acceptedTerms,
				sector: body.data.sector,
				nombre_socioComunitario: body.data.name,
				url: body.data.url,
				mision: body.data.mission
			});
			break;
		default:
			throw createError({ statusCode: 400, statusMessage: 'Rol no válido' });
	}

	return session.update({
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		role: body.data.role
	});
});
