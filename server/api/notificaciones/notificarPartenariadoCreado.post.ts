import TNotificacion from '../../utils/database/services/Transfer/tNotificacion';
import { notificarPartenariadoRellenado } from '../../utils/database/services/daos/daoNotificacion';

export default eventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const notificacion: TNotificacion = {
			id: null,
			idDestino: null,
			leido: null,
			titulo: 'Partenariado creado',
			mensaje: 'Enhorabuena, se ha creado el partenariado',
			fecha_fin: null,
			emailOrigen: null,
			idOferta: null,
			tituloOferta: null,
			idMatching: 1,
			idDemanda: 0,
			tituloDemanda: '',
			pendiente: false,
			idPartenariado: query.idPartenariado as number
		};
		await notificarPartenariadoRellenado(notificacion);
		return {
			ok: true
		};
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado (al intentar crear notificacionPartenariadoCreado)' });
	}
});
