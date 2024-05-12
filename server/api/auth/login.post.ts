import { isNullish } from '@sapphire/utilities';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { ViewUserPrivileged } from '~/server/utils/database/services/types/views/UserPrivileged';

const bodySchema = z.object({
	email: z.string().trim(),
	password: z.string().trim()
});
export default eventHandler(async (event) => {
	const { email, password } = await readValidatedBody(event, bodySchema.parse);

	// Autenticar al usuario y obtener el token de acceso
	const data = await fetchAccessToken(email, password);
	if (!data) {
		throw createError({ message: 'Authentication failed', statusCode: 401 });
	}

	// La autenticación fue exitosa, ahora actualizamos la sesión del usuario
	const session = await useAuthSession(event);
	await session.update(data);
	return session.data;
});

async function fetchAccessToken(email: string, password: string): Promise<AuthSession> {
	const entry = await qb(ViewUserPrivileged.Name).where({ email }).first();
	if (isNullish(entry)) {
		throw createError({ message: 'No existe usuario con el correo electrónico', statusCode: 401 });
	}

	const valid = await bcrypt.compare(password, entry.password);
	if (!valid) {
		throw createError({ message: 'Contraseña incorrecta', statusCode: 401 });
	}

	return { id: entry.id, email: entry.email, avatar: entry.avatar, firstName: entry.firstName, lastName: entry.lastName, role: entry.role };
}
