import { z } from 'zod';
import { contarTodasDemandasServicio, obtenerTodasDemandasServicio } from '~/server/utils/database/services/daos/daoDemanda';

const schemaFilter = z.object({
	necesidadSocial: z.string(),
	creador: z.string().optional(),
	entidadDemandante: z.string().optional(),
	areaServicio: z.string().optional(),
	terminoBusqueda: z.string().optional()
});
const schema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(25),
	skip: z.coerce.number().int().min(0).default(0),
	filtros: z.preprocess((arg) => JSON.parse(arg as string), schemaFilter.array())
});

export default eventHandler(async (event) => {
	const query = await getValidatedQuery(event, schema.parse);
	const demandas = await obtenerTodasDemandasServicio(query.limit, query.skip, query.filtros);
	const total = await contarTodasDemandasServicio();
	return { demandas, total };
});
