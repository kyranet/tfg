import cargarNotificacion from '../../utils/database/services/daos/daoNotificacion';

export default eventHandler(async (event) => {
	try {
		const id = event.context.params.id;
		const notificacion = await cargarNotificacion(id);
		return {
			ok: true,
			notificacion
		};
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado (al intentar obtenerNotificacion)' });
	}
});
