import { isNullishOrEmpty } from '@sapphire/utilities';
import bcrypt from 'bcryptjs';
import type { H3Event } from 'h3';
import { z } from 'zod';
import type { ViewUser } from '~/server/utils/database/services/types/views/User';
import type { ViewUserAdmin } from '~/server/utils/database/services/types/views/UserAdmin';
import type { ViewUserApSOffice } from '~/server/utils/database/services/types/views/UserApSOffice';
import type { ViewUserCommunityPartner } from '~/server/utils/database/services/types/views/UserCommunityPartner';
import type { ViewUserExternalProfessor } from '~/server/utils/database/services/types/views/UserExternalProfessor';
import type { ViewUserExternalStudent } from '~/server/utils/database/services/types/views/UserExternalStudent';
import type { ViewUserInternalProfessor } from '~/server/utils/database/services/types/views/UserInternalProfessor';
import type { ViewUserInternalStudent } from '~/server/utils/database/services/types/views/UserInternalStudent';
import {
	actualizarAdmin,
	actualizarEstudianteExterno,
	actualizarEstudianteInterno,
	actualizarOficinaAPS,
	actualizarProfesorExterno,
	actualizarProfesorInterno,
	actualizarSocioComunitario,
	obtenerUsuarioSinRolPorId,
	type UpdateUserData
} from '../../../utils/database/services/daos/daoUsuario';

const baseSchemaBody = z.object({
	password: z.string().trim().min(6).max(100).optional(),
	firstName: z.string().trim().min(2).max(100).optional(),
	lastName: z.string().trim().min(2).max(100).optional(),
	phone: z.number().int().optional(),
	acceptedTerms: z.boolean().optional()
});

const schemaParams = z.object({ id: CoercedIntegerId.or(z.literal('@me')) });
export default eventHandler(async (event) => {
	const session = await requireAuthSession(event);
	let { id } = await getValidatedRouterParams(event, schemaParams.parse);
	if (id === '@me') {
		id = session.data.id;
	}

	// Only administrators can update other users:
	if (session.data.id !== id && session.data.role !== 'Admin') {
		throw createError({ statusCode: 403, statusMessage: 'Operación no autorizada, solo gestores.' });
	}

	const usuario = await obtenerUsuarioSinRolPorId(id);

	let updated: ViewUser.Value;
	switch (usuario.role) {
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
			updated = await updateExternalStudent(usuario as ViewUserExternalStudent.Value, event);
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

	if (updated.id === session.data.id) {
		await session.update({
			id: updated.id,
			email: updated.email,
			avatar: updated.avatar,
			firstName: updated.firstName,
			lastName: updated.lastName,
			role: updated.role
		});
	}

	return updated;
});

async function sharedReadBody<T>(event: H3Event, schema: z.ZodType<T>): Promise<T & { avatar: Buffer | null }> {
	const contentType = event.headers.get('content-type');
	if (contentType === 'application/json') {
		return { ...(await readValidatedBody(event, schema.parse)), avatar: null };
	}

	if (contentType === 'multipart/form-data') {
		const parts = await readMultipartFormData(event);
		if (isNullishOrEmpty(parts)) {
			throwValidationError('No se ha proporcionado ningún dato');
		}

		let json: T | null = null;
		let avatar: Buffer | null = null;
		for (const part of parts) {
			if (part.name === 'payload_json') {
				if (json !== null) {
					throwValidationError('Se ha proporcionado más de un campo JSON');
				}

				json = schema.parse(JSON.parse(part.data.toString()));
			} else if (part.name === 'avatar') {
				if (avatar !== null) {
					throwValidationError('Se ha proporcionado más de un archivo');
				}

				avatar = part.data;
			}
		}

		return { ...(json ?? {}), avatar } as T & { avatar: Buffer | null };
	}

	throwValidationError('Tipo de contenido no soportado');
}

async function sharedReplacePassword<T extends z.infer<typeof baseSchemaBody>>(body: T): Promise<T> {
	return {
		...body,
		password: isNullishOrEmpty(body.password) ? undefined : await bcrypt.hash(body.password, await bcrypt.genSalt())
	};
}

const schemaBodyAdmin = baseSchemaBody;
async function updateAdmin(user: ViewUserAdmin.Value, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyAdmin);
	return actualizarAdmin(user.id, await sharedReplacePassword(body));
}

const schemaBodyInternalProfessor = z
	.object({ university: z.number().int().optional(), faculty: z.string().trim().optional(), knowledgeAreas: z.number().int().array().optional() })
	.merge(baseSchemaBody);
async function updateInternalProfessor(user: ViewUserInternalProfessor.Value, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyInternalProfessor);
	return actualizarProfesorInterno(user.id, await sharedReplacePassword(body));
}

const schemaBodyExternalProfessor = z
	.object({ university: z.number().int().optional(), faculty: z.string().trim().optional(), knowledgeAreas: z.number().int().array().optional() })
	.merge(baseSchemaBody);
async function updateExternalProfessor(user: ViewUserExternalProfessor.Value, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyExternalProfessor);
	return actualizarProfesorExterno(user.id, await sharedReplacePassword(body));
}

const schemaBodyInternalStudent = z //
	.object({ degree: z.number().int().optional() })
	.merge(baseSchemaBody);
async function updateInternalStudent(user: ViewUserInternalStudent.Value, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyInternalStudent);
	return actualizarEstudianteInterno(user.id, await sharedReplacePassword(body));
}

const schemaBodyExternalStudent = z //
	.object({ degree: z.string().optional(), university: z.number().int().optional() })
	.merge(baseSchemaBody);
async function updateExternalStudent(user: ViewUserExternalStudent.Value, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyExternalStudent);
	return actualizarEstudianteExterno(user.id, await sharedReplacePassword(body));
}

const schemaBodyApSOffice = baseSchemaBody;
async function updateApSOffice(user: ViewUserApSOffice.Value, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyApSOffice);
	return actualizarOficinaAPS(user.id, await sharedReplacePassword(body));
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
	const body = await sharedReadBody(event, schemaBodyCommunityPartner);
	return actualizarSocioComunitario(user.id, await sharedReplacePassword(body));
}
