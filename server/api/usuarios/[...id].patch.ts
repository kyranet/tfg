import { isNullishOrEmpty } from '@sapphire/utilities';
import bcrypt from 'bcryptjs';
import type { H3Event } from 'h3';
import { z } from 'zod';
import type { ViewUser } from '~/server/utils/database/services/types/views/User';
import type { ViewUserAdmin } from '~/server/utils/database/services/types/views/UserAdmin';
import type { ViewUserApSOffice } from '~/server/utils/database/services/types/views/UserApSOffice';
import type { ViewUserCommunityPartner } from '~/server/utils/database/services/types/views/UserCommunityPartner';
import type { ViewUserExternalProfessor } from '~/server/utils/database/services/types/views/UserExternalProfessor';
import type { ViewUserInternalProfessor } from '~/server/utils/database/services/types/views/UserInternalProfessor';
import type { ViewUserInternalStudent } from '~/server/utils/database/services/types/views/UserInternalStudent';
import {
	UpdateAdminData,
	actualizarAdmin,
	actualizarEstudianteExterno,
	actualizarEstudianteInterno,
	actualizarOficinaAPS,
	actualizarProfesorExterno,
	actualizarProfesorInterno,
	actualizarSocioComunitario,
	maybeGetUsuarioSinRolPorEmail,
	obtenerUsuarioSinRolPorId
} from '../../utils/database/services/daos/daoUsuario';

const baseSchemaBody = z.object({
	email: z.string().trim().email().optional(),
	password: z.string().trim().min(6).max(100).optional(),
	firstName: z.string().trim().min(2).max(100).optional(),
	lastName: z.string().trim().min(2).max(100).optional(),
	phone: z.number().int().optional(),
	acceptedTerms: z.boolean().optional()
});

const schemaParams = z.object({ id: CoercedIntegerId });
export default eventHandler(async (event) => {
	const session = await requireAuthSession(event);
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);

	// Only administrators can update other users:
	if (session.data.id !== id && session.data.role !== 'Admin') {
		throw createError({ statusCode: 403, statusMessage: 'Operación no autorizada, solo gestores.' });
	}

	const usuario = await obtenerUsuarioSinRolPorId(id);

	let updated: ViewUser.Value;
	switch (usuario.user.type) {
		case 'Admin':
			updated = await updateAdmin(usuario as ViewUserAdmin.Value, event);
			break;
		case 'InternalProfessor':
			updated = await updateInternalProfessor(usuario as ViewUserInternalProfessor.Value, event);
			break;
		case 'ExternalProfessor':
			updated = await updateExternalProfessor(usuario as ViewUserExternalProfessor.Value, event);
			break;
		case 'InternalStudent':
			updated = await updateInternalStudent(usuario as ViewUserInternalStudent.Value, event);
			break;
		case 'ExternalStudent':
			updated = await updateExternalStudent(usuario as ViewUserInternalStudent.Value, event);
			break;
		case 'ApSOffice':
			updated = await updateApSOffice(usuario as ViewUserApSOffice.Value, event);
			break;
		case 'CommunityPartner':
			updated = await updateCommunityPartner(usuario as ViewUserCommunityPartner.Value, event);
			break;
		default:
			throw createError({ statusCode: 400, statusMessage: 'No se puede actualizar los datos para tu rol' });
	}

	const data: AuthSession = {
		id: updated.id,
		email: updated.email,
		firstName: updated.firstName,
		lastName: updated.lastName,
		role: updated.user.type
	};
	if (updated.id === session.data.id) {
		await session.update(data);
	}

	return data;
});

async function sharedValidateBody(user: ViewUser.Value, body: z.infer<typeof baseSchemaBody>): Promise<UpdateAdminData> {
	let correo: string | undefined = undefined;
	if (!isNullishOrEmpty(body.email) && user.email !== body.email) {
		const existing = await maybeGetUsuarioSinRolPorEmail(body.email);
		if (existing && user.id !== existing.id) {
			throw createError({ statusCode: 400, statusMessage: 'El correo ya está registrado' });
		}

		correo = body.email;
	}

	return {
		nombre: body.firstName,
		apellidos: body.lastName,
		correo,
		telefono: body.phone,
		terminos_aceptados: body.acceptedTerms,
		password: isNullishOrEmpty(body.password) ? undefined : await bcrypt.hash(body.password, await bcrypt.genSalt())
	};
}

const schemaBodyAdmin = baseSchemaBody;
async function updateAdmin(user: ViewUserAdmin.Value, event: H3Event) {
	const body = await readValidatedBody(event, schemaBodyAdmin.parse);
	return actualizarAdmin(user.id, await sharedValidateBody(user, body));
}

const schemaBodyInternalProfessor = z
	.object({ university: z.number().int().optional(), faculty: z.string().trim().optional(), knowledgeAreas: z.number().int().array().optional() })
	.merge(baseSchemaBody);
async function updateInternalProfessor(user: ViewUserInternalProfessor.Value, event: H3Event) {
	const body = await readValidatedBody(event, schemaBodyInternalProfessor.parse);
	return actualizarProfesorInterno(user.id, {
		...(await sharedValidateBody(user, body)),
		universidad: body.university,
		facultad: body.faculty,
		knowledgeAreas: body.knowledgeAreas
	});
}

const schemaBodyExternalProfessor = z
	.object({ university: z.number().int().optional(), faculty: z.string().trim().optional() })
	.merge(baseSchemaBody);
async function updateExternalProfessor(user: ViewUserExternalProfessor.Value, event: H3Event) {
	const body = await readValidatedBody(event, schemaBodyExternalProfessor.parse);
	return actualizarProfesorExterno(user.id, {
		...(await sharedValidateBody(user, body)),
		universidad: body.university,
		facultad: body.faculty
	});
}

const schemaBodyInternalStudent = z //
	.object({ degree: z.number().int().optional() })
	.merge(baseSchemaBody);
async function updateInternalStudent(user: ViewUserInternalStudent.Value, event: H3Event) {
	const body = await readValidatedBody(event, schemaBodyInternalStudent.parse);
	return actualizarEstudianteInterno(user.id, {
		...(await sharedValidateBody(user, body)),
		titulacion_local: body.degree
	});
}

const schemaBodyExternalStudent = z //
	.object({ degree: z.string().optional(), universityId: z.number().int().optional() })
	.merge(baseSchemaBody);
async function updateExternalStudent(user: ViewUserInternalStudent.Value, event: H3Event) {
	const body = await readValidatedBody(event, schemaBodyExternalStudent.parse);
	return actualizarEstudianteExterno(user.id, {
		...(await sharedValidateBody(user, body)),
		titulacion: body.degree,
		universidad: body.universityId
	});
}

const schemaBodyApSOffice = baseSchemaBody;
async function updateApSOffice(user: ViewUserApSOffice.Value, event: H3Event) {
	const body = await readValidatedBody(event, schemaBodyApSOffice.parse);
	return actualizarOficinaAPS(user.id, await sharedValidateBody(user, body));
}

const schemaBodyCommunityPartner = z
	.object({
		sector: z.string().trim().optional(),
		name: z.string().trim().optional(),
		url: z.string().trim().optional(),
		mission: z.string().trim().optional()
	})
	.merge(baseSchemaBody);
async function updateCommunityPartner(user: ViewUserCommunityPartner.Value, event: H3Event) {
	const body = await readValidatedBody(event, schemaBodyCommunityPartner.parse);
	return actualizarSocioComunitario(user.id, {
		...(await sharedValidateBody(user, body)),
		sector: body.sector,
		nombre: body.name,
		url: body.url,
		mision: body.mission
	});
}
