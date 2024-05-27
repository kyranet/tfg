import type { Knex } from 'knex';
import { Notificacion } from '../../types/Notificacion';

export async function finishPendingNotification(idNotificacion: number, trx: Knex.Transaction): Promise<void> {
	await trx(Notificacion.Name).where({ id: idNotificacion }).update({ pendiente: false });
}
