import type { AreaServicio } from './AreaServicio';
import type { Iniciativa } from './Iniciativa';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface AreaServicio_Iniciativa {
	/** Foreign key of @linkcode {@linkcode AreaServicio.id} */
	id_area: PrimaryKey<ForeignKey<AreaServicio, 'id'>>;
	/** Foreign key of @linkcode {@linkcode Iniciativa.id} */
	id_iniciativa: PrimaryKey<ForeignKey<Iniciativa, 'id'>>;
}

export namespace AreaServicio_Iniciativa {
	export const Name = 'areaservicio_iniciativa';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<AreaServicio_Iniciativa> {}
	export interface CreateData extends GetCreateType<AreaServicio_Iniciativa> {}
}
