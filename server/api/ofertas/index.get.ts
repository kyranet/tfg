import { z } from 'zod';
import { contarTodasOfertasServicio, obtenerTodasOfertasServicio } from '~/server/utils/database/services/daos/daoOferta';
import { SearchQuery } from '~/server/utils/validators/shared';

const schemaQuery = SearchQuery.merge(
	z.object({
		cuatrimestre: z.string().array(),
		terminoBusqueda: z.string().optional(),
		creador: z.string().optional(),
		profesor: z.string().optional(),
		tags: z.string().array().optional()
	})
);
export default eventHandler(async (event) => {
	const options = await getValidatedQuery(event, schemaQuery.parse);
	const ofertas = await obtenerTodasOfertasServicio(options);
	const total = await contarTodasOfertasServicio();
	return { ofertas, total };
});
