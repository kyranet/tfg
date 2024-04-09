import { z } from 'zod';

const bodySchema = z.object({
	email: z.string(),
	password: z.string()
});
export default eventHandler(async (event) => {
	const { email, password } = await readValidatedBody(event, bodySchema.parse);
	try {
		// Autenticar al usuario y obtener el token de acceso
		const data = await fetchAccessToken(email, password);
		if (!data) {
			throw createError({ message: 'Authentication failed', statusCode: 401 });
		}

		// La autenticación fue exitosa, ahora actualizamos la sesión del usuario
		const session = await useAuthSession(event);
		await session.update(data);
		return session.data;
	} catch (error) {
		throw createError({ message: 'Login failed', statusCode: 500 });
	}
});

// TODO: Implementar la lógica de autenticación
function fetchAccessToken(_email: string, _password: string): Promise<AuthSession | null> {
	return Promise.resolve(null);
}
