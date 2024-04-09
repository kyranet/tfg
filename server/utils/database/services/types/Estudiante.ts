import type { Usuario } from './Usuario';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface Estudiante {
	/** Foreign key of {@linkcode Usuario.id} */
	id: PrimaryKey<ForeignKey<Usuario, 'id'>>;
}

export namespace Estudiante {
	export const Name = 'estudiante';

	export interface Value extends GetType<Estudiante> {}
	export interface CreateData extends GetCreateType<Estudiante> {}
}
