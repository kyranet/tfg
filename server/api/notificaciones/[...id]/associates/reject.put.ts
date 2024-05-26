import { z } from 'zod';
import { obtenerNotificacionOfertaAceptada } from '~/server/utils/database/services/daos/notificacion/get';
import { crearNotificacionAceptadacionRechazada } from '~/server/utils/database/services/daos/notificacion/insert';

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
