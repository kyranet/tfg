import type { Notificacion } from './Notificacion';
import type { Partenariado } from './Partenariado';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface PartenariadoRellenado {
	/** Foreign key of {@linkcode Notificacion.id} */
	idNotificacion: PrimaryKey<ForeignKey<Notificacion, 'id'>>;
	/** Foreign key of {@linkcode Partenariado.id} */
	idPartenariado: ForeignKey<Partenariado, 'id'>;
}

export namespace PartenariadoRellenado {
	export const Name = 'partenariadorellenado';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<PartenariadoRellenado> {}
	export interface CreateData extends GetCreateType<PartenariadoRellenado> {}
}
