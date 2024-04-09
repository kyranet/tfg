import { z } from 'zod';
import { contarTodasOfertasServicio, obtenerTodasOfertasServicio } from '~/server/utils/database/services/daos/daoOferta';
import { SearchQuery, stringJSON } from '~/server/utils/validators/shared';

const filterSchema = z.object({
	cuatrimestre: z.string().array(),
	terminoBusqueda: z.string(),
	creador: z.string().optional(),
	profesor: z.string().optional(),
	tags: z.string().array().optional()
});
const schemaQuery = z //
	.object({ filtros: stringJSON(filterSchema) })
	.merge(SearchQuery);

export default eventHandler(async (event) => {
	const { limit, skip, filtros } = await getValidatedQuery(event, schemaQuery.parse);
	const ofertas = await obtenerTodasOfertasServicio(limit, skip, filtros);
	const total = await contarTodasOfertasServicio();
	return { ofertas, total };
});
