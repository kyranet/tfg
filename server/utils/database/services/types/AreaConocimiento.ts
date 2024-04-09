import type { AutoIncrement, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface AreaConocimiento {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
}

export namespace AreaConocimiento {
	export const name = 'area_conocimiento';

	export interface Value extends GetType<AreaConocimiento> {}
	export interface CreateData extends GetCreateType<AreaConocimiento> {}
}
