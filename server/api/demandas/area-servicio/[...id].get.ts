import { z } from 'zod';
import { obtenerDemandaPorAreaServicio } from '~/server/utils/database/services/daos/daoDemanda';

const schema = z.object({ id: CoercedIntegerId });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schema.parse);
	return obtenerDemandaPorAreaServicio(id);
});
