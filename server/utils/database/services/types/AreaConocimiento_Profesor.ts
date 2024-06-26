import type { AreaConocimiento } from './AreaConocimiento';
import type { Profesor } from './Profesor';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface AreaConocimiento_Profesor {
	/** Foreign key of {@linkcode AreaConocimiento.id} */
	id_area: PrimaryKey<ForeignKey<AreaConocimiento, 'id'>>;
	/** Foreign key of {@linkcode Profesor.id} */
	id_profesor: PrimaryKey<ForeignKey<Profesor, 'id'>>;
}

export namespace AreaConocimiento_Profesor {
	export const Name = 'areaconocimiento_profesor';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<AreaConocimiento_Profesor> {}
	export interface CreateData extends GetCreateType<AreaConocimiento_Profesor> {}
}
