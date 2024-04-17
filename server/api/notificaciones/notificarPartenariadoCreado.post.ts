import { notifyPartnershipFilled } from '~/server/utils/database/services/daos/daoNotificacion';
import { Notificacion } from '~/server/utils/database/services/types/Notificacion';

export default eventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const notificacion: Notificacion = {
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
		await notifyPartnershipFilled(notificacion);
		return {
			ok: true
		};
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado (al intentar crear notificacionPartenariadoCreado)' });
	}
});
