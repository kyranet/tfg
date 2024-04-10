import type { Estudiante } from './Estudiante';
import type { Proyecto } from './Proyecto';
import {
	makeKeyFunction,
	type AutoIncrement,
	type Float,
	type ForeignKey,
	type GetCreateType,
	type GetType,
	type Int,
	type PrimaryKey
} from './base/Shared';

export interface Nota {
	id: PrimaryKey<AutoIncrement<Int>>;
	/** Foreign key of {@linkcode Estudiante.id} */
	id_estudiante: ForeignKey<Estudiante, 'id'>;
	/** Foreign key of {@linkcode Proyecto.id} */
	id_proyecto: ForeignKey<Proyecto, 'id'>;
	nota: Float;
}

export namespace Nota {
	export const Name = 'notas';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Nota> {}
	export interface CreateData extends GetCreateType<Nota> {}
}
