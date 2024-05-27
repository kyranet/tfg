import { z } from 'zod';
import { crearNotificacionDemandaRespalda } from '~/server/utils/database/services/daos/notificacion/insert';

const schemaBody = z.object({ userId: z.number().int(), deadline: z.coerce.date(), partnershipId: z.number().int() });
export default eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	await crearNotificacionDemandaRespalda({
		userId: body.userId,
		title: 'Demanda Respaldada',
		message: 'Enhorabuena, un profesor ha respaldado su demanda',
		pending: true,
		read: false,
		deadline: body.deadline,
		partnershipId: body.partnershipId
	});

	return null;
});
