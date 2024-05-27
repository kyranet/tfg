import type { Matching } from './Matching';
import type { Notificacion } from './Notificacion';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface NotificacionMatching {
	/** Foreign key of {@linkcode Notificacion.id} */
	idNotificacion: PrimaryKey<ForeignKey<Notificacion, 'id'>>;
	/** Foreign key of {@linkcode Matching.id_oferta} */
	idOferta: ForeignKey<Matching, 'id_oferta'>;
	/** Foreign key of {@linkcode Matching.id_demanda} */
	idDemanda: ForeignKey<Matching, 'id_demanda'>;
}

export namespace NotificacionMatching {
	export const Name = 'notificacionmatching';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<NotificacionMatching> {}
	export interface CreateData extends GetCreateType<NotificacionMatching> {}
}
