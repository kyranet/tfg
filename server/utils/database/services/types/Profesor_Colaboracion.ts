import type { Colaboracion } from './Colaboracion';
import type { Profesor } from './Profesor';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface Profesor_Colaboracion {
	/** Foreign key of {@linkcode Profesor.id} */
	id_profesor: PrimaryKey<ForeignKey<Profesor, 'id'>>;
	/** Foreign key of {@linkcode Colaboracion.id} */
	id_colaboracion: PrimaryKey<ForeignKey<Colaboracion, 'id'>>;
}

export namespace Profesor_Colaboracion {
	export const Name = 'profesor_colaboracion';

	export interface Value extends GetType<Profesor_Colaboracion> {}
	export interface CreateData extends GetCreateType<Profesor_Colaboracion> {}
}
