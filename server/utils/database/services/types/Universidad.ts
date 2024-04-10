import { makeKeyFunction, type AutoIncrement, type GetCreateType, type GetType, type Int, type PrimaryKey, type VarChar } from './base/Shared';

export interface Universidad {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
	provincia: VarChar<200>;
}

export namespace Universidad {
	export const Name = 'universidad';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Universidad> {}
	export interface CreateData extends GetCreateType<Universidad> {}
}
