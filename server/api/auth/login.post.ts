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
		await session.update({ id: token.userId, /* revisión */ });
		//revisón que podemos devolver aqui
		return {
		  message: 'Login successful',
		  token: token.accessToken, // Puedes devolver el token de acceso al cliente
		};
	  } catch (error) {
		throw createError({ message: 'Login failed', statusCode: 500 });
	  }
});

interface OAuth2BodyData {
	email: string;
	password: string;
}
