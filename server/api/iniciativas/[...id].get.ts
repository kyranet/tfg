import { z } from 'zod';
import { getInitiative } from '~/server/utils/database/services/daos/daoIniciativa';
import { CoercedIntegerId } from '~/server/utils/validators/shared';

const schemaParams = z.object({ id: CoercedIntegerId });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	return getInitiative(id);
});
