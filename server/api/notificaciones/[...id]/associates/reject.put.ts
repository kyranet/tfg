import { z } from 'zod';
import { crearNotificacionAceptadacionRechazada, obtenerNotificacionOfertaAceptada } from '~/server/utils/database/services/daos/daoNotificacion';

const schemaParams = z.object({ id: CoercedIntegerId });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	const oferta = await obtenerNotificacionOfertaAceptada(id);
	await crearNotificacionAceptadacionRechazada({
		...oferta,
		title: 'Oferta Rechazada',
		message: 'Oops, su petición ha sido rechazada',
		offerId: oferta.id
	});

	return null;
});
