import { z } from 'zod';
import { crearNotificacionAceptadacionAceptada } from '~/server/utils/database/services/daos/notificacion/insert';
import { obtenerNotificacionOfertaAceptada } from '~/server/utils/database/services/daos/notificacion/get';

const schemaParams = z.object({ id: CoercedIntegerId });
const schemaBody = z.object({ partnershipId: z.number().int() });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	const body = await readValidatedBody(event, schemaBody.parse);

	const oferta = await obtenerNotificacionOfertaAceptada(id);
	await crearNotificacionAceptadacionAceptada({
		...oferta,
		title: 'Petición Aceptada',
		message: 'Enhorabuena, su petición ha sido aceptada',
		partnershipId: body.partnershipId,
		offerId: oferta.id
	});

	return null;
});
