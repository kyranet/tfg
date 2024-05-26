import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { maybeGetUsuarioSinRolPorEmail } from '~/server/utils/database/services/daos/usuario/get';
import { insertarEstudianteExterno, insertarProfesorExterno, insertarSocioComunitario } from '~/server/utils/database/services/daos/usuario/insert';

const schemaBodyProfessor = z.object({
	role: z.literal('ExternalProfessor'),
	university: z.number().int(),
	faculty: z.string().trim(),
	knowledgeAreas: z.number().int().array()
});
const schemaBodyStudent = z.object({
	role: z.literal('ExternalStudent'),
	university: z.number().int(),
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
		case 'ExternalProfessor':
			user = await insertarProfesorExterno({
				email: body.email,
				firstName: body.firstName,
				lastName: body.lastName,
				phone: body.phone,
				password,
				acceptedTerms: body.acceptedTerms,
				university: body.data.university,
				faculty: body.data.faculty,
				knowledgeAreas: body.data.knowledgeAreas
			});
			break;
		case 'ExternalStudent':
			user = await insertarEstudianteExterno({
				email: body.email,
				firstName: body.firstName,
				lastName: body.lastName,
				phone: body.phone,
				password,
				acceptedTerms: body.acceptedTerms,
				degree: body.data.degree,
				university: body.data.university
			});
			break;
		case 'CommunityPartner':
			user = await insertarSocioComunitario({
				email: body.email,
				firstName: body.firstName,
				lastName: body.lastName,
				phone: body.phone,
				password,
				acceptedTerms: body.acceptedTerms,
				sector: body.data.sector,
				name: body.data.name,
				url: body.data.url,
				mission: body.data.mission
			});
			break;
		default:
			throw createError({ statusCode: 400, statusMessage: 'Rol no válido' });
	}

	return session.update({
		id: user.id,
		email: user.email,
		avatar: user.avatar,
		firstName: user.firstName,
		lastName: user.lastName,
		role: body.data.role
	});
});
