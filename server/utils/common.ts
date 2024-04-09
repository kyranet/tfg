export function getFirstDatabaseEntry<Type>(values: readonly Type[], message: string): Type {
	if (values.length === 0) {
		throw createError({ message, statusCode: 404 });
	}

	return values[0];
}
