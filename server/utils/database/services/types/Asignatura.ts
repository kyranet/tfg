import type { OfertaServicio } from './OfertaServicio';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey, VarChar } from './base/Shared';

export interface Asignatura {
	/** Foreign key of {@linkcode OfertaServicio.id} */
	id_oferta: PrimaryKey<ForeignKey<OfertaServicio, 'id'>>;
	nombre: VarChar<200>;
}

export namespace Asignatura {
	export const name = 'asignatura';

	export interface Value extends GetType<Asignatura> {}
	export interface CreateData extends GetCreateType<Asignatura> {}
}
