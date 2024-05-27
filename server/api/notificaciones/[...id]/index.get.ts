import { z } from 'zod';
import { getNotification } from '~/server/utils/database/services/daos/notificacion/get';

const schemaParams = z.object({ id: CoercedIntegerId });
export default eventHandler(async (event) => {
	const session = await requireAuthSession(event);
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	return getNotification(session.data.id, id);
});
