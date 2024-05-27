import type { OfertaServicio } from './OfertaServicio';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey, type VarChar } from './base/Shared';

export interface Asignatura {
	/** Foreign key of {@linkcode OfertaServicio.id} */
	id_oferta: PrimaryKey<ForeignKey<OfertaServicio, 'id'>>;
	nombre: VarChar<200>;
}

export namespace Asignatura {
	export const Name = 'asignatura';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Asignatura> {}
	export interface CreateData extends GetCreateType<Asignatura> {}
}
