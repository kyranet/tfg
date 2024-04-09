import type { Matching } from './Matching';
import type { Notificacion } from './Notificacion';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface NotificacionMatching {
	/** Foreign key of {@linkcode Notificacion.id} */
	idNotificacion: PrimaryKey<ForeignKey<Notificacion, 'id'>>;
	/** Foreign key of {@linkcode Matching.id_oferta} */
	idOferta: ForeignKey<Matching, 'id_oferta'>;
	/** Foreign key of {@linkcode Matching.id_demanda} */
	idDemanda: ForeignKey<Matching, 'id_demanda'>;
}

export namespace NotificacionMatching {
	export const name = 'notificacionmatching';

	export interface Value extends GetType<NotificacionMatching> {}
	export interface CreateData extends GetCreateType<NotificacionMatching> {}
}
