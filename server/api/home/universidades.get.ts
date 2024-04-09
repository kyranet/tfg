import { defineEventHandler, createError } from 'h3';
import { obtenerUniversidades } from '../../utils/database/services/daos/daoUsuario';

export default defineEventHandler(async () => {
	try {
		const codeList = await obtenerUniversidades();

		return {
			ok: true,
			codeList
		};
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
	}
});
