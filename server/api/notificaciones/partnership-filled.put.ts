import { z } from 'zod';
import { notifyPartnershipFilled } from '~/server/utils/database/services/daos/daoNotificacion';

const schemaBody = z.object({ userId: z.number().int(), deadline: z.coerce.date(), partnershipId: z.number().int() });
export default eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	await notifyPartnershipFilled({
		userId: body.userId,
		title: 'Partenariado creado',
		message: 'Enhorabuena, se ha creado el partenariado',
		pending: true,
		read: false,
		deadline: body.deadline,
		partnershipId: body.partnershipId
	});

	return null;
});
