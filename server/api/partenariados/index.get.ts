import { z } from 'zod';
import { obtenerPartenariados } from '~/server/utils/database/services/daos/daoPartenariado';

const schema = SearchQuery.merge(z.object({ filtros: z.string() }));
export default eventHandler(async (event) => {
	const { limit, skip, filtros } = await getValidatedQuery(event, schema.parse);
	return obtenerPartenariados(limit, skip, filtros);
});
