import type { Usuario } from './Usuario';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface Estudiante {
	/** Foreign key of {@linkcode Usuario.id} */
	id: PrimaryKey<ForeignKey<Usuario, 'id'>>;
}

export namespace Estudiante {
	export const Name = 'estudiante';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Estudiante> {}
	export interface CreateData extends GetCreateType<Estudiante> {}
}
