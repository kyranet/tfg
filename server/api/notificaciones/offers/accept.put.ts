import { z } from 'zod';
import { crearNotificacionOfertaAceptada } from '~/server/utils/database/services/daos/notificacion/insert';

const schemaBody = z.object({ deadline: z.coerce.date(), offerId: z.number().int() });
export default eventHandler(async (event) => {
	const session = await requireAuthSession(event);
	const body = await readValidatedBody(event, schemaBody.parse);

	await crearNotificacionOfertaAceptada({
		title: 'Oferta Aceptada',
		message: 'Enhorabuena, su oferta ha sido aceptada',
		pending: true,
		read: false,
		deadline: body.deadline,
		offerId: body.offerId,
		associateId: session.data.id
	});

	return null;
});
