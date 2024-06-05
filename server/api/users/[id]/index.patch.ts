import { isNullishOrEmpty } from '@sapphire/utilities';
import bcrypt from 'bcryptjs';
import type { H3Event } from 'h3';
import { z } from 'zod';
import {
	actualizarAdmin,
	actualizarEstudianteExterno,
	actualizarEstudianteInterno,
	actualizarOficinaAPS,
	actualizarProfesorExterno,
	actualizarProfesorInterno,
	actualizarSocioComunitario
} from '~/server/utils/database/services/daos/usuario/update';
import type { ViewUser } from '~/server/utils/database/services/types/views/User';
import { ViewUserPrivileged } from '~/server/utils/database/services/types/views/UserPrivileged';

const baseSchemaBody = z.object({
	password: z.string().trim().min(6).max(100).optional(),
	currentPassword: z.string().trim().min(6).max(100).optional(),
	firstName: z.string().trim().min(2).max(100).optional(),
	lastName: z.string().trim().min(2).max(100).optional(),
	phone: z.number().int().optional(),
	avatar: z.null().optional(),
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
	const isSelf = session.data.id === id;
	if (!isSelf && session.data.role !== 'Admin') {
		throw createError({ statusCode: 403, statusMessage: 'Operación no autorizada, solo gestores.' });
	}

	const usuario = ensureDatabaseEntry(await qb(ViewUserPrivileged.Name).where({ id }).first());
	let updated: ViewUser.Value;
	switch (usuario.role) {
		case 'Admin':
			updated = await updateAdmin(usuario, isSelf, event);
			break;
		case 'InternalProfessor':
			updated = await updateInternalProfessor(usuario, isSelf, event);
			break;
		case 'ExternalProfessor':
			updated = await updateExternalProfessor(usuario, isSelf, event);
			break;
		case 'InternalStudent':
			updated = await updateInternalStudent(usuario, isSelf, event);
			break;
		case 'ExternalStudent':
			updated = await updateExternalStudent(usuario, isSelf, event);
			break;
		case 'ApSOffice':
			updated = await updateApSOffice(usuario, isSelf, event);
			break;
		case 'CommunityPartner':
			updated = await updateCommunityPartner(usuario, isSelf, event);
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

const FilesRegExp = /^files\[(\d+)\]$/;
async function sharedReadBody<T>(event: H3Event, schema: z.ZodType<T>): Promise<T & { avatar: Buffer | null }> {
	const contentType = event.headers.get('content-type');
	if (contentType === 'application/json') {
		return { ...(await readValidatedBody(event, schema.parse)), avatar: null };
	}

	if (contentType?.startsWith('multipart/form-data')) {
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
				continue;
			}

			if (isNullishOrEmpty(part.name)) {
				throwValidationError('Se ha proporcionado un campo sin nombre');
			}

			const match = FilesRegExp.exec(part.name);
			if (match !== null) {
				if (avatar !== null) {
					throwValidationError('Se ha proporcionado más de un archivo');
				}

				if (match[1] !== '0') {
					throwValidationError('El archivo proporcionado no es válido');
				}

				avatar = part.data;
			}
		}

		return { avatar, ...(json ?? {}) } as T & { avatar: Buffer | null };
	}

	throwValidationError('Tipo de contenido no soportado');
}

async function sharedReplacePassword<T extends z.infer<typeof baseSchemaBody>>(user: ViewUserPrivileged.Value, isSelf: boolean, body: T): Promise<T> {
	let password: string | undefined = undefined;
	if (!isNullishOrEmpty(body.password)) {
		if (isSelf) {
			if (isNullishOrEmpty(body.currentPassword)) {
				throwValidationError('Se debe proporcionar la contraseña actual');
			}

			const valid = await bcrypt.compare(body.currentPassword, user.password);
			if (!valid) {
				throwValidationError('La contraseña actual no es válida');
			}
		}

		password = await bcrypt.hash(body.password, await bcrypt.genSalt());
	}

	return { ...body, password };
}

const schemaBodyAdmin = baseSchemaBody;
async function updateAdmin(user: ViewUserPrivileged.Value, isSelf: boolean, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyAdmin);
	return actualizarAdmin(user.id, await sharedReplacePassword(user, isSelf, body));
}

const schemaBodyInternalProfessor = z
	.object({ university: z.number().int().optional(), faculty: z.string().trim().optional(), knowledgeAreas: z.number().int().array().optional() })
	.merge(baseSchemaBody);
async function updateInternalProfessor(user: ViewUserPrivileged.Value, isSelf: boolean, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyInternalProfessor);
	return actualizarProfesorInterno(user.id, await sharedReplacePassword(user, isSelf, body));
}

const schemaBodyExternalProfessor = z
	.object({ university: z.number().int().optional(), faculty: z.string().trim().optional(), knowledgeAreas: z.number().int().array().optional() })
	.merge(baseSchemaBody);
async function updateExternalProfessor(user: ViewUserPrivileged.Value, isSelf: boolean, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyExternalProfessor);
	return actualizarProfesorExterno(user.id, await sharedReplacePassword(user, isSelf, body));
}

const schemaBodyInternalStudent = z //
	.object({ degree: z.number().int().optional() })
	.merge(baseSchemaBody);
async function updateInternalStudent(user: ViewUserPrivileged.Value, isSelf: boolean, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyInternalStudent);
	return actualizarEstudianteInterno(user.id, await sharedReplacePassword(user, isSelf, body));
}

const schemaBodyExternalStudent = z //
	.object({ degree: z.string().optional(), university: z.number().int().optional() })
	.merge(baseSchemaBody);
async function updateExternalStudent(user: ViewUserPrivileged.Value, isSelf: boolean, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyExternalStudent);
	return actualizarEstudianteExterno(user.id, await sharedReplacePassword(user, isSelf, body));
}

const schemaBodyApSOffice = baseSchemaBody;
async function updateApSOffice(user: ViewUserPrivileged.Value, isSelf: boolean, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyApSOffice);
	return actualizarOficinaAPS(user.id, await sharedReplacePassword(user, isSelf, body));
}

const schemaBodyCommunityPartner = z
	.object({
		sector: z.string().trim().optional(),
		name: z.string().trim().optional(),
		url: z.string().trim().optional(),
		mission: z.string().trim().optional()
	})
	.merge(baseSchemaBody);
async function updateCommunityPartner(user: ViewUserPrivileged.Value, isSelf: boolean, event: H3Event) {
	const body = await sharedReadBody(event, schemaBodyCommunityPartner);
	return actualizarSocioComunitario(user.id, await sharedReplacePassword(user, isSelf, body));
}
