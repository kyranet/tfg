import { crearNotificacionDemandaRespalda } from '~/server/utils/database/services/daos/daoNotificacion';
import { Notificacion } from '~/server/utils/database/services/types/Notificacion';

export default eventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const notificacion: Notificacion = {
			id: null,
			idDestino: body.idDestino,
			leido: null,
			titulo: 'Demanda Respaldada',
			mensaje: 'Enhorabuena, un profesor ha respaldado su demanda',
			fecha_fin: null,
			emailOrigen: body.emailOrigen,
			idOferta: null,
			tituloOferta: null,
			idMatching: 1,
			idDemanda: body.idDemanda,
			tituloDemanda: body.tituloDemanda,
			pendiente: true,
			idPartenariado: body.idPartenariado
		};
		await crearNotificacionDemandaRespalda(notificacion);
		return {
			ok: true
		};
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado (al intentar crear notificacionDemandaRespaldada)' });
	}
});