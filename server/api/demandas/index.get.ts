import { obtenerTodasDemandasServicio, contarTodasDemandasServicio } from '../../utils/database/services/daos/daoDemanda';
import z from 'zod';

const schemaFilter = z.object({
	necesidadSocial: z.string(),
	creador: z.string().optional(),
	entidadDemandante: z.string().optional(),
	areaServicio: z.string().optional(),
	terminoBusqueda: z.string().optional()
});
const schema = z.object({
	limit: z.number({ coerce: true }).min(1).max(100).optional(),
	skip: z.number({ coerce: true }).min(0).optional(),
	filtros: z.preprocess((arg) => JSON.parse(arg as string), schemaFilter.array())
});

export default eventHandler(async (event) => {
	const query = await getValidatedQuery(event, schema.parse);
	const demandas = await obtenerTodasDemandasServicio(query.limit ?? 25, query.skip ?? 0, query.filtros);
	const total = await contarTodasDemandasServicio();
	return { demandas, total };
});
