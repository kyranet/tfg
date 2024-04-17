import { z } from 'zod';
import { crearNotificacionAceptadacionAceptada, obtenerNotificacionOfertaAceptada } from '../../../../utils/database/services/daos/daoNotificacion';

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
