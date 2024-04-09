import type { Notificacion } from './Notificacion';
import type { OfertaServicio } from './OfertaServicio';
import type { ForeignKey, GetCreateType, GetType, Int, PrimaryKey } from './base/Shared';

export interface OfertaAceptada {
	/** Foreign key of {@linkcode Notificacion.id} */
	idNotificacion: PrimaryKey<ForeignKey<Notificacion, 'id'>>;
	/** Foreign key of {@linkcode OfertaServicio.id} */
	idOferta: PrimaryKey<ForeignKey<OfertaServicio, 'id'>>;
	idSocio: Int;
}

export namespace OfertaAceptada {
	export const name = 'ofertaaceptada';

	export interface Value extends GetType<OfertaAceptada> {}
	export interface CreateData extends GetCreateType<OfertaAceptada> {}
}
