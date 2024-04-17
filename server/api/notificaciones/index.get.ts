import { getNotifications } from '../../utils/database/services/daos/daoNotificacion';

export default eventHandler(async (event) => {
	const user = await requireAuthSession(event);
	try {
		const query = getQuery(event);
		let notificaciones = await getNotifications(user.data.id);
		return {
			ok: true,
			notificaciones,
			total: notificaciones.length
		};
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
	}
});
