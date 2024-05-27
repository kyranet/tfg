import { z } from 'zod';
import { getPartnership } from '~/server/utils/database/services/daos/colaboracion/get';

const schema = z.object({ id: z.coerce.number().int() });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schema.parse);
	return getPartnership(id);
});
