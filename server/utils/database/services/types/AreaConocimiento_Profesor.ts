import type { AreaConocimiento } from './AreaConocimiento';
import type { Profesor } from './Profesor';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface AreaConocimiento_Profesor {
	/** Foreign key of {@linkcode AreaConocimiento.id} */
	id_area: PrimaryKey<ForeignKey<AreaConocimiento, 'id'>>;
	/** Foreign key of {@linkcode Profesor.id} */
	id_profesor: PrimaryKey<ForeignKey<Profesor, 'id'>>;
}

export namespace AreaConocimiento_Profesor {
	export const name = 'areaconocimiento_profesor';

	export interface Value extends GetType<AreaConocimiento_Profesor> {}
	export interface CreateData extends GetCreateType<AreaConocimiento_Profesor> {}
}
