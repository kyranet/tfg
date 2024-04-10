import { isNullish } from '@sapphire/utilities';

export function getFirstDatabaseEntry<Type>(values: readonly Type[], message = 'No se ha podido encontrar una entrada válida en la base de datos'): Type {
	if (values.length === 0) {
		throw createNotFoundError(message);
	}

	return values[0];
}

export function ensureDatabaseEntry<Type>(value: Type | undefined, message = 'No se ha podido encontrar una entrada válida en la base de datos'): Type {
	if (isNullish(value)) {
		throw createNotFoundError(message);
	}

	return value;
}

export function createNotFoundError(message: string): Error {
	return createError({ message, statusCode: 404 });
}
