import type { Profesor } from './Profesor';
import {
	makeKeyFunction,
	type AutoIncrement,
	type Defaults,
	type ForeignKey,
	type GetCreateType,
	type GetType,
	type Int,
	type PrimaryKey,
	type VarChar
} from './base/Shared';

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
	export const Name = 'colaboracion';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Colaboracion> {}
	export interface CreateData extends GetCreateType<Colaboracion> {}
}
