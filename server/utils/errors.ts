function makeError(statusCode: number, message: string) {
	return { statusCode, message };
}

export function throwValidationError(message: string): never {
	throw makeError(400, message);
}

export function throwForbiddenError(message: string): never {
	throw makeError(403, message);
}

export function throwNotFoundError(message: string): never {
	throw makeError(404, message);
}
