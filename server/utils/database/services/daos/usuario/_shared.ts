import type { DatosPersonalesExterno } from '../../types/DatosPersonalesExterno';
import type { DatosPersonalesInterno } from '../../types/DatosPersonalesInterno';
import type { Usuario } from '../../types/Usuario';
import type { ViewUser } from '../../types/views/User';
import type { ViewUserExternalProfessor } from '../../types/views/UserExternalProfessor';

/**
 * Fixes the `user` property of a `ViewUser` entry from a JSON string to an object. This function is required as the
 * `JSON` type in MariaDB aliases the `TEXT` type, which in turn will not be parsed by any database client or driver.
 *
 * @param entry The entry to parse
 * @returns The parsed entry
 */
export function parseViewUserJsonStringProperties(entry: ViewUser.RawValue): ViewUser.Value;
export function parseViewUserJsonStringProperties(entry: ViewUser.RawValue | undefined): ViewUser.Value | undefined;
export function parseViewUserJsonStringProperties(entry: ViewUser.RawValue | undefined): ViewUser.Value | undefined {
	if (!entry) return entry;

	const { data, ...rest } = entry;
	return Object.assign(rest, JSON.parse(data));
}

export function parseViewUserExternalProfessorJsonStringProperties(entry: ViewUserExternalProfessor.RawValue): ViewUserExternalProfessor.Value;
export function parseViewUserExternalProfessorJsonStringProperties(
	entry: ViewUserExternalProfessor.RawValue | undefined
): ViewUserExternalProfessor.Value | undefined;
export function parseViewUserExternalProfessorJsonStringProperties(
	entry: ViewUserExternalProfessor.RawValue | undefined
): ViewUserExternalProfessor.Value | undefined {
	if (!entry) return entry;

	return { ...entry, knowledgeAreas: JSON.parse(entry.knowledgeAreas as unknown as string) };
}

export function formatUser<User extends ViewUser.ValueUserType>(
	datos: BaseUserData,
	data: ViewUser.ValueUserOfType<User>
): ViewUser.ValueOfType<User> {
	return {
		id: datos.id,
		createdAt: datos.createdAt,
		firstName: datos.nombre,
		lastName: datos.apellidos,
		email: datos.correo,
		phone: datos.telefono,
		...data
	} as unknown as ViewUser.ValueOfType<User>;
}

export type BaseUserData = Usuario.Value & (DatosPersonalesInterno.Value | DatosPersonalesExterno.Value);
