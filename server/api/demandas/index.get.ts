import { z } from 'zod';
import { contarTodasDemandasServicio } from '~/server/utils/database/services/daos/demanda/count';
import { obtenerTodasDemandasServicio } from '~/server/utils/database/services/daos/demanda/get';
import { SearchQuery } from '~/server/utils/validators/shared';

const schema = z //
	.object({
		query: z.string().optional(),
		socialNeed: z.string().array().optional(),
		creator: z.string().optional(),
		serviceAreas: z.string().array().optional(),
		withCounts: z.coerce.boolean().optional()
	})
	.merge(SearchQuery);

export default eventHandler(async (event) => {
	const query = await getValidatedQuery(event, schema.parse);
	const [count, entries] = await Promise.all([
		query.withCounts ? contarTodasDemandasServicio() : undefined, //
		obtenerTodasDemandasServicio(query)
	]);
	return { count, entries };
});
