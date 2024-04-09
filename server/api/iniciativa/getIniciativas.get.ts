import { defineEventHandler, createError, getQuery } from 'h3';
import Iniciativa from '~/models/iniciativa.model';

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const skip = Number(query.skip) || 0;
		const limit = Number(query.limit) || Number.MAX_SAFE_INTEGER;
		const filtros = JSON.parse(query.filtros || '{}');

		// TODO logica filtrado
		const [iniciativas, filtradas, total] = await Promise.all([
			Iniciativa.find().skip(skip).limit(limit),
			Iniciativa.countDocuments(),
			Iniciativa.countDocuments()
		]);

		return {
			ok: true,
			iniciativas,
			filtradas,
			total
		};
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
	}
});
