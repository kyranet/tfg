import { defineEventHandler, createError } from 'h3';
import { obtenerAnuncioPorAreaServicio } from '../../utils/database/services/daos/daoOferta';

export default defineEventHandler(async (event) => {
	try {
		const id = event.context.params.id as unknown as number;
		let ofertas = await obtenerAnuncioPorAreaServicio(id);
		return { ok: true, ofertas };
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
	}
});
