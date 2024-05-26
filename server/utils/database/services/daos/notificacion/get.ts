import { ViewNotification } from '../../types/views/Notification';
import { ViewNotificationOfferAccepted } from '../../types/views/NotificationOfferAccepted';

export async function getNotifications(userId: number): Promise<ViewNotification.Value[]> {
	return await qb(ViewNotification.Name).where({ userId });
}

export async function getNotification(userId: number, id: number): Promise<ViewNotification.Value> {
	return ensureDatabaseEntry(
		await qb(ViewNotification.Name).where({ id, userId }).first(),
		'No se pudo encontrar una notificación con el ID proporcionado'
	);
}

export async function obtenerNotificacionOfertaAceptada(id: number): Promise<ViewNotificationOfferAccepted.Value> {
	return ensureDatabaseEntry(
		await qb(ViewNotificationOfferAccepted.Name).where({ id }).first(),
		'No se pudo encontrar la notificación con el ID proporcionado'
	);
}
