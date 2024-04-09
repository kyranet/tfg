import { z } from 'zod';
import { actualizarPartenariado, obtenerPartenariado } from '~/server/utils/database/services/daos/daoColaboracion';

const schemaParams = z.object({ id: z.coerce.number().int() });
const schemaBody = z.object({
	demanda: z.coerce.number().int(),
	titulo: z.string(),
	descripcion: z.string(),
	externos: z.boolean(),
	profesores: z.string().array()
});
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	const body = await readValidatedBody(event, schemaBody.parse);
	let partenariado = await obtenerPartenariado(id);

	if (!partenariado) {
		throw createError({ statusCode: 404, statusMessage: 'Partenariado no encontrado' });
	}

	partenariado.id_demanda = body.demanda;
	partenariado.titulo = body.titulo;
	partenariado.descripcion = body.descripcion;
	partenariado.admite_externos = body.externos;
	partenariado.profesores = body.profesores;
	await actualizarPartenariado(partenariado);

	return partenariado;
});
