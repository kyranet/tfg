import { z } from 'zod';
import { obtenerDemandaPorAreaServicio } from '~/server/utils/database/services/daos/daoDemanda';

const schema = z.object({ id: z.coerce.number().int() });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schema.parse);
	return obtenerDemandaPorAreaServicio(id);
});
