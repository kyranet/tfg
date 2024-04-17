import { getNotifications } from '../../utils/database/services/daos/daoNotificacion';

export default eventHandler(async (event) => {
	const session = await requireAuthSession(event);
	return getNotifications(session.data.id);
});
