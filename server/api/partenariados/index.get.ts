import { z } from 'zod';
import { obtenerTodosPartenariados } from '~/server/utils/database/services/daos/daoColaboracion';

const schema = SearchQuery.merge(z.object({ creador: z.string().optional() }));
export default eventHandler(async (event) => {
	return obtenerTodosPartenariados(await getValidatedQuery(event, schema.parse));
});
