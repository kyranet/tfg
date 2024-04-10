import type { Notificacion } from './Notificacion';
import type { OfertaAceptada } from './OfertaAceptada';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface AceptacionRechazada {
	/** Foreign key of {@linkcode Notificacion.id} */
	idNotificacion: PrimaryKey<ForeignKey<Notificacion, 'id'>>;
	/** Foreign key of {@linkcode OfertaAceptada.idNotificacion} */
	idNotificacionOferta: PrimaryKey<ForeignKey<OfertaAceptada, 'idNotificacion'>>;
}

export namespace AceptacionRechazada {
	export const Name = 'aceptacionrechazado';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<AceptacionRechazada> {}
	export interface CreateData extends GetCreateType<AceptacionRechazada> {}
}
