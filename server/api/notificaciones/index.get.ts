import { getNotifications } from '../../utils/database/services/daos/notificacion/get';

export default eventHandler(async (event) => {
	const session = await requireAuthSession(event);
	return getNotifications(session.data.id);
});
