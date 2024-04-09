import type { Notificacion } from './Notificacion';
import type { Partenariado } from './Partenariado';
import type { ForeignKey, GetCreateType, GetType, Int, PrimaryKey } from './base/Shared';

export interface AceptacionAceptada {
	/** Foreign key of {@linkcode Notificacion.id} */
	idNotificacion: PrimaryKey<ForeignKey<Notificacion, 'id'>>;
	/** Foreign key of {@linkcode Partenariado.id} */
	idPartenariado: ForeignKey<Partenariado, 'id'>;
	idNotificacionAceptada: Int;
}

export namespace AceptacionAceptada {
	export const name = 'aceptacionaceptada';

	export interface Value extends GetType<AceptacionAceptada> {}
	export interface CreateData extends GetCreateType<AceptacionAceptada> {}
}
