import { z } from 'zod';
import { obtenerPartenariados } from '~/server/utils/database/services/daos/daoPartenariado';

const schema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(25),
	skip: z.coerce.number().int().min(0).default(0),
	filtros: z.string()
});
export default eventHandler(async (event) => {
	const { limit, skip, filtros } = await getValidatedQuery(event, schema.parse);
	return obtenerPartenariados(limit, skip, filtros);
});
