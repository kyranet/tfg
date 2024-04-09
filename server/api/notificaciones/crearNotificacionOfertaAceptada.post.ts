import { crearNotificacionOfertaAceptada } from '~/server/utils/database/services/daos/daoNotificacion';
import { Notificacion } from '~/server/utils/database/services/types/Notificacion';

//Del codigo original no logro saber cuales son los que se crean en este punto
//TODO revisar
export default eventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const notificacion: Notificacion = {
			id: null,
			idDestino: null,
			leido: null,
			titulo: 'Oferta Aceptada',
			mensaje: 'Enhorabuena, su oferta ha sido aceptada',
			fecha_fin: null,
			emailOrigen: null,
			idOferta: query.idOferta as number,
			tituloOferta: null,
			idMatching: 1,
			idDemanda: 0,
			tituloDemanda: '',
			pendiente: false,
			idPartenariado: 0
		};
		let notificacionId = await crearNotificacionOfertaAceptada(notificacion, query.idSocio);
		return {
			ok: true,
			notificacionId
		};
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado (al intentar crearNotificacionOfertaAceptada)' });
	}
});
