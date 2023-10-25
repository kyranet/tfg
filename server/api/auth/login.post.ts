export default eventHandler(async (event) => {
	const { email, password } = (await readBody(event)) as OAuth2BodyData;
	if (typeof email !== 'string' || typeof password !== 'string') {
		throwValidationError('Invalid body parameters');
	}
	try {
		// Autenticar al usuario y obtener el token de acceso
		const token = await fetchAccessToken(email, password);
		if (!token) {
			throw createError({ message: 'Authentication failed', statusCode: 401 });
		}

		// La autenticación fue exitosa, ahora actualizamos la sesión del usuario
		const session = await useAuthSession(event);
		await session.update({ id: token.userId /* revisión */ });
		return session.data;
	} catch (error) {
		throw createError({ message: 'Login failed', statusCode: 500 });
	}
});

function fetchAccessToken(_email: string, _password: string): Promise<AccessTokenResult | null> {
	return Promise.resolve(null);
}

interface OAuth2BodyData {
	email: string;
	password: string;
}

interface AccessTokenResult {
	userId: string;
}
