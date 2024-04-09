import type { Profesor } from './Profesor';
import type { AutoIncrement, Defaults, ForeignKey, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface Colaboracion {
	id: PrimaryKey<AutoIncrement<Int>>;
	titulo: VarChar<200>;
	descripcion: VarChar<1200>;
	imagen: Defaults<VarChar<200> | null>;
	admite_externos: Defaults<boolean>;
	/** Foreign key of {@linkcode Profesor.id} */
	responsable: ForeignKey<Profesor, 'id'>;
}

export namespace Colaboracion {
	export const name = 'colaboracion';

	export interface Value extends GetType<Colaboracion> {}
	export interface CreateData extends GetCreateType<Colaboracion> {}
}
