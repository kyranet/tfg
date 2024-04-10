import { z } from 'zod';
import { obtenerPartenariados } from '~/server/utils/database/services/daos/daoPartenariado';

const schema = SearchQuery.merge(z.object({ creador: z.string().optional() }));
export default eventHandler(async (event) => {
	const { limit, skip, creador } = await getValidatedQuery(event, schema.parse);
	return obtenerPartenariados(limit, skip, creador);
});
