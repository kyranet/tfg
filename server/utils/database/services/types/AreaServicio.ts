import type { AutoIncrement, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface AreaServicio {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
}

export namespace AreaServicio {
	export const Name = 'area_servicio';

	export interface Value extends GetType<AreaServicio> {}
	export interface CreateData extends GetCreateType<AreaServicio> {}
}
