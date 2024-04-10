import { makeKeyFunction, type AutoIncrement, type GetCreateType, type GetType, type Int, type PrimaryKey, type VarChar } from './base/Shared';

export interface AreaServicio {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
}

export namespace AreaServicio {
	export const Name = 'area_servicio';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<AreaServicio> {}
	export interface CreateData extends GetCreateType<AreaServicio> {}
}
