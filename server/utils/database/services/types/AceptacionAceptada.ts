import type { Notificacion } from './Notificacion';
import type { Partenariado } from './Partenariado';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type Int, type PrimaryKey } from './base/Shared';

export interface AceptacionAceptada {
	/** Foreign key of {@linkcode Notificacion.id} */
	idNotificacion: PrimaryKey<ForeignKey<Notificacion, 'id'>>;
	/** Foreign key of {@linkcode Partenariado.id} */
	idPartenariado: ForeignKey<Partenariado, 'id'>;
	idNotificacionAceptada: Int;
}

export namespace AceptacionAceptada {
	export const Name = 'aceptacionaceptada';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<AceptacionAceptada> {}
	export interface CreateData extends GetCreateType<AceptacionAceptada> {}
}
