import { crearNotificacionAceptadacionRechazada, obtenerNotificacionOfertaAceptada } from '~/server/utils/database/services/daos/daoNotificacion';
import { Notificacion } from '~/server/utils/database/services/types/Notificacion';

//Del codigo original no logro saber cuales son los que se crean en este punto
//TODO revisar
export default eventHandler(async (event) => {
	try {
		const query = getQuery(event);
		let ofertaAceptada = await obtenerNotificacionOfertaAceptada(query.idNotificacion);
		const notificacion: Notificacion = {
			id: null,
			idDestino: ofertaAceptada[0].idSocio,
			leido: null,
			titulo: 'Peticion rechazada',
			mensaje: 'Ops, su peticion ha sido rechazada',
			fecha_fin: null,
			emailOrigen: null,
			idOferta: ofertaAceptada[0].idOferta,
			tituloOferta: null,
			idMatching: 1,
			idDemanda: 0,
			tituloDemanda: '',
			pendiente: false,
			idPartenariado: 0
		};
		return crearNotificacionAceptadacionRechazada(notificacion, query.idNotificacion);
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado (al intentar rechazarSocio)' });
	}
});