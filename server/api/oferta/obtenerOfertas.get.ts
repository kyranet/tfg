import { defineEventHandler, createError, getQuery } from 'h3';
import { obtenerTodasOfertasServicio, contarTodasOfertasServicio } from '../../utils/database/services/daos/daoOferta';

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		let ofertas = await obtenerTodasOfertasServicio(query.limit as number, query.skip as number, query.filtros as string);
		let total = await contarTodasOfertasServicio();
		return { ok: true, ofertas, total };
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
	}
});
