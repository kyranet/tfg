import { z } from 'zod';
import { obtenerDemandaServicio } from '~/server/utils/database/services/daos/daoDemanda';
import { CoercedIntegerId } from '~/server/utils/validators/shared';

const schemaParams = z.object({ id: CoercedIntegerId });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	return obtenerDemandaServicio(id);
});
