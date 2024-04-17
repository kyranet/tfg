import type { Knex } from 'knex';
import { AceptacionAceptada } from '../types/AceptacionAceptada';
import { AceptacionRechazada } from '../types/AceptacionRechazada';
import { DemandaRespalda } from '../types/DemandaRespalda';
import { DemandaServicio } from '../types/DemandaServicio';
import { Notificacion } from '../types/Notificacion';
import { OfertaAceptada } from '../types/OfertaAceptada';
import { OfertaServicio } from '../types/OfertaServicio';
import { Partenariado } from '../types/Partenariado';
import { PartenariadoRellenado } from '../types/PartenariadoRellenado';
import { ViewNotification } from '../types/views/Notification';
import { ViewNotificationOfferAccepted } from '../types/views/NotificationOfferAccepted';

export interface CreateNotificationOptions extends Omit<ViewNotification.Value, 'id' | 'data'> {}
async function createNotification(data: CreateNotificationOptions, trx: Knex.Transaction): Promise<Notificacion.Value> {
	const [entry] = await trx(Notificacion.Name)
		.insert({
			idDestino: data.userId,
			leido: data.read,
			titulo: data.title,
			mensaje: data.message,
			fecha_fin: data.deadline,
			pendiente: data.pending
		})
		.returning('*');

	return entry;
}

export interface CreateAceptacionAceptadaOptions extends CreateNotificationOptions {
	partnerId: AceptacionAceptada.Value['idPartenariado'];
	acceptedNotificationId: AceptacionAceptada.Value['idNotificacionAceptada'];
}
export async function createAceptacionAceptada(data: CreateAceptacionAceptadaOptions) {
	return await qb.transaction(async (trx) => {
		const base = await createNotification(data, trx);
		await trx(AceptacionAceptada.Name).insert({
			idNotificacion: base.id,
			idPartenariado: data.partnerId,
			idNotificacionAceptada: data.acceptedNotificationId
		});
	});
}

export interface CreateAceptacionRechazadaOptions extends CreateNotificationOptions {
	acceptedNotificationId: AceptacionRechazada.Value['idNotificacionOferta'];
}
export async function createAceptacionRechazada(data: CreateAceptacionRechazadaOptions) {
	return await qb.transaction(async (trx) => {
		const base = await createNotification(data, trx);
		await trx(AceptacionRechazada.Name).insert({
			idNotificacion: base.id,
			idNotificacionOferta: data.acceptedNotificationId
		});
	});
}

export async function getNotifications(userId: number): Promise<ViewNotification.Value[]> {
	return await qb(ViewNotification.Name).where({ userId });
}

export async function getNotification(userId: number, id: number): Promise<ViewNotification.Value> {
	return ensureDatabaseEntry(
		await qb(ViewNotification.Name).where({ id, userId }).first(),
		'No se pudo encontrar una notificación con el ID proporcionado'
	);
}

export interface CreateNotificationOfferAcceptedOptions extends Omit<CreateNotificationOptions, 'userId'> {
	offerId: OfertaServicio.Value['id'];
	associateId: OfertaAceptada.Value['idSocio'];
}
export async function crearNotificacionOfertaAceptada(data: CreateNotificationOfferAcceptedOptions) {
	return await qb.transaction(async (trx) => {
		const { userId } = ensureDatabaseEntry(
			await trx(OfertaServicio.Name)
				.where({ id: data.offerId })
				.select({ userId: 'creador' } as const)
				.first(),
			'No se pudo encontrar la oferta con el ID proporcionado'
		);

		const base = await createNotification({ ...data, userId }, trx);
		await trx(OfertaAceptada.Name).insert({
			idNotificacion: base.id,
			idOferta: data.offerId,
			idSocio: data.associateId
		});
	});
}

export async function obtenerNotificacionOfertaAceptada(id: number): Promise<ViewNotificationOfferAccepted.Value> {
	return ensureDatabaseEntry(
		await qb(ViewNotificationOfferAccepted.Name).where({ id }).first(),
		'No se pudo encontrar la notificación con el ID proporcionado'
	);
}

async function finishPendingNotification(idNotificacion: number, trx: Knex.Transaction): Promise<void> {
	await trx(Notificacion.Name).where({ id: idNotificacion }).update({ pendiente: false });
}

export interface CreateConfirmationRejectedOptions extends CreateNotificationOptions {
	offerId: AceptacionRechazada.Value['idNotificacionOferta'];
}
export async function crearNotificacionAceptadacionRechazada(data: CreateConfirmationRejectedOptions): Promise<any> {
	return await qb.transaction(async (trx) => {
		const base = await createNotification(data, trx);
		await trx(AceptacionRechazada.Name).insert({
			idNotificacion: base.id,
			idNotificacionOferta: data.offerId
		});
		await finishPendingNotification(data.offerId, trx);
	});
}

export interface CreateConfirmationAcceptedOptions extends CreateNotificationOptions {
	partnershipId: AceptacionAceptada.Value['idPartenariado'];
	offerId: AceptacionAceptada.Value['idNotificacionAceptada'];
}
export async function crearNotificacionAceptadacionAceptada(data: CreateConfirmationAcceptedOptions) {
	return await qb.transaction(async (trx) => {
		const base = await createNotification(data, trx);
		await trx(AceptacionAceptada.Name).insert({
			idNotificacion: base.id,
			idPartenariado: data.partnershipId,
			idNotificacionAceptada: data.offerId
		});
		await finishPendingNotification(data.offerId, trx);
	});
}

export interface CreateBackedDemandOptions extends CreateNotificationOptions {
	partnershipId: DemandaRespalda.Value['idPartenariado'];
}
export async function crearNotificacionDemandaRespalda(data: CreateBackedDemandOptions) {
	return await qb.transaction(async (trx) => {
		const base = await createNotification(data, trx);
		await trx(DemandaRespalda.Name).insert({
			idNotificacion: base.id,
			idPartenariado: data.partnershipId
		});
	});
}

export interface CreateNotificationPartnershipFilledOptions extends CreateNotificationOptions {
	partnershipId: PartenariadoRellenado.Value['idPartenariado'];
}
async function crearNotificationPartnershipFilled(data: CreateNotificationPartnershipFilledOptions, trx: Knex.Transaction): Promise<any> {
	const base = await createNotification(data, trx);
	await trx(PartenariadoRellenado.Name).insert({
		idNotificacion: base.id,
		idPartenariado: data.partnershipId
	});
}

export interface NotifyMatchingNotificationOptions extends CreateNotificationPartnershipFilledOptions {}
export async function notifyPartnershipFilled(data: NotifyMatchingNotificationOptions) {
	return await qb.transaction(async (trx) => {
		const { offerCreatorId, demandCreatorId, notificationId } = ensureDatabaseEntry(
			await trx(Partenariado.Name)
				.innerJoin(OfertaServicio.Name, OfertaServicio.Key('id'), '=', Partenariado.Key('id_oferta'))
				.innerJoin(DemandaServicio.Name, DemandaServicio.Key('id'), '=', Partenariado.Key('id_demanda'))
				.leftJoin(AceptacionAceptada.Name, AceptacionAceptada.Key('idPartenariado'), '=', Partenariado.Key('id'))
				.leftJoin(DemandaRespalda.Name, DemandaRespalda.Key('idPartenariado'), '=', Partenariado.Key('id'))
				.leftJoin(Notificacion.Name, (join) =>
					join
						.on(Notificacion.Key('id'), '=', AceptacionAceptada.Key('idNotificacion'))
						.orOn(Notificacion.Key('id'), '=', DemandaRespalda.Key('idNotificacion'))
				)
				.where({ id: data.partnershipId })
				.select({
					offerCreatorId: OfertaServicio.Key('creador'),
					demandCreatorId: DemandaServicio.Key('creador'),
					notificationId: Notificacion.Key('id')
				})
				.first(),
			'No se pudo encontrar el partenariado con el ID proporcionado'
		);

		await crearNotificationPartnershipFilled({ ...data, userId: offerCreatorId }, trx);
		await crearNotificationPartnershipFilled({ ...data, userId: demandCreatorId }, trx);

		if (notificationId) await finishPendingNotification(notificationId, trx);
	});
}
