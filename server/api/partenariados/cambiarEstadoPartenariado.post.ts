import { defineEventHandler, readBody, createError } from 'h3';
import { obtenerPartenariado, actualizarEstadoPartenariado } from '../../utils/database/services/daos/daoColaboracion';

export default defineEventHandler(async (event) => {
	try {
		const id = event.context.params.id as unknown as number;
		const body = await readBody(event);
		let partenariado = await obtenerPartenariado(id);
		partenariado.status = body.estado;
		await actualizarEstadoPartenariado(partenariado);
		return { ok: true };
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
	}
});
