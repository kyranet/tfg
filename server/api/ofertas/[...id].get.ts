import { z } from 'zod';
import { obtenerOfertaServicio } from '~/server/utils/database/services/daos/oferta/get';
import { CoercedIntegerId } from '~/server/utils/validators/shared';

const schemaParams = z.object({ id: CoercedIntegerId });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	return obtenerOfertaServicio(id);
});
