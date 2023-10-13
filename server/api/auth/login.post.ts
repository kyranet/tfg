export default eventHandler(async (event) => {
	const { email, password } = (await readBody(event)) as OAuth2BodyData;
	if (typeof email !== 'string' || typeof password !== 'string') {
		throwValidationError('Invalid body parameters');
	}

	// TODO(Sebastianrza): Hook this with the DB and define what will be exposed
	// const data = await fetchAccessToken(email, password);
	// if (!data) {
	// 	throw createError({ message: 'Failed to fetch the token', statusCode: 500 });
	// }

	// const session = await useAuthSession(event);
	// await session.update({ id: data.id, /* session.data (AuthSession at /server/utils/session.ts) */ });
	// return session.data;

	throw createError({ message: 'Not implemented', statusCode: 500 });
});

interface OAuth2BodyData {
	email: string;
	password: string;
}
