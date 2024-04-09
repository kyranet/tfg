import { z } from 'zod';
import { obtenerPartenariado } from '~/server/utils/database/services/daos/daoColaboracion';

const schema = z.object({ id: z.coerce.number().int() });
export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schema.parse);
	return obtenerPartenariado(id);
});
