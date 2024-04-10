import { makeKeyFunction, type AutoIncrement, type GetCreateType, type GetType, type Int, type PrimaryKey, type VarChar } from './base/Shared';

export interface AreaConocimiento {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
}

export namespace AreaConocimiento {
	export const Name = 'area_conocimiento';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<AreaConocimiento> {}
	export interface CreateData extends GetCreateType<AreaConocimiento> {}
}
