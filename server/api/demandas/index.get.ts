import { z } from 'zod';
import { contarTodasDemandasServicio, obtenerTodasDemandasServicio } from '~/server/utils/database/services/daos/daoDemanda';
import { SearchQuery } from '~/server/utils/validators/shared';

const schema = z //
	.object({
		terminoBusqueda: z.string(),
		necesidadSocial: z.string().array().optional(),
		creador: z.string().optional(),
		entidadDemandante: z.string().optional(),
		areaServicio: z.string().array().optional()
	})
	.merge(SearchQuery);

export default eventHandler(async (event) => {
	const query = await getValidatedQuery(event, schema.parse);
	const demandas = await obtenerTodasDemandasServicio(query);
	const total = await contarTodasDemandasServicio();
	return { demandas, total };
});
