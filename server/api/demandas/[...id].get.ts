import { obtenerDemandaServicio } from '../../utils/database/services/daos/daoDemanda';
import z from 'zod';

const schema = z.object({ id: z.number({ coerce: true }) });

export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schema.parse);
	return obtenerDemandaServicio(id);
});
