import { makeKeyFunction, type AutoIncrement, type GetCreateType, type GetType, type Int, type PrimaryKey, type VarChar } from './base/Shared';

export interface MatchingArea {
	id: PrimaryKey<AutoIncrement<Int>>;
	area_conocimiento: VarChar<200>;
	area_servicio: VarChar<200>;
}

export namespace MatchingArea {
	export const Name = 'matching_areas';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<MatchingArea> {}
	export interface CreateData extends GetCreateType<MatchingArea> {}
}
