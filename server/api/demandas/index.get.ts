import { z } from 'zod';
import { contarTodasDemandasServicio, obtenerTodasDemandasServicio } from '~/server/utils/database/services/daos/daoDemanda';
import { SearchQuery, stringJSON } from '~/server/utils/validators/shared';

const schemaFilter = z.object({
	necesidadSocial: z.string(),
	creador: z.string().optional(),
	entidadDemandante: z.string().optional(),
	areaServicio: z.string().optional(),
	terminoBusqueda: z.string().optional()
});
const schema = z //
	.object({ filtros: stringJSON(schemaFilter.array()) })
	.merge(SearchQuery);

export default eventHandler(async (event) => {
	const query = await getValidatedQuery(event, schema.parse);
	const demandas = await obtenerTodasDemandasServicio(query.limit, query.skip, query.filtros);
	const total = await contarTodasDemandasServicio();
	return { demandas, total };
});
