export function getFirstDatabaseEntry<Type>(values: readonly Type[], message: string): Type {
	if (values.length === 0) {
		throw createNotFoundError(message);
	}

	return values[0];
}

export function createNotFoundError(message: string): Error {
	return createError({ message, statusCode: 404 });
}
