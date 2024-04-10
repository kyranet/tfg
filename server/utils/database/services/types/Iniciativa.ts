import type { DemandaServicio } from './DemandaServicio';
import type { Estudiante } from './Estudiante';
import type { NecesidadSocial } from './NecesidadSocial';
import {
	makeKeyFunction,
	type AutoIncrement,
	type ForeignKey,
	type GetCreateType,
	type GetType,
	type Int,
	type PrimaryKey,
	type Unique,
	type VarChar
} from './base/Shared';

export interface Iniciativa {
	id: PrimaryKey<AutoIncrement<Int>>;
	titulo: VarChar<200>;
	descripcion: VarChar<1200>;
	/** Foreign key of {@linkcode Estudiante.id} */
	id_estudiante: ForeignKey<Estudiante, 'id'>;
	/** Foreign key of {@linkcode DemandaServicio.id} */
	id_demanda: Unique<ForeignKey<DemandaServicio, 'id'>>;
	/** Foreign key of {@linkcode NecesidadSocial.id} */
	necesidad_social: ForeignKey<NecesidadSocial, 'id'>;
}

export namespace Iniciativa {
	export const Name = 'iniciativa';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Iniciativa> {}
	export interface CreateData extends GetCreateType<Iniciativa> {}
}
