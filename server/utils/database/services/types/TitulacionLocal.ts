import { makeKeyFunction, type AutoIncrement, type GetCreateType, type GetType, type Int, type PrimaryKey, type VarChar } from './base/Shared';

export interface TitulacionLocal {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
}

export namespace TitulacionLocal {
	export const Name = 'titulacion_local';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<TitulacionLocal> {}
	export interface CreateData extends GetCreateType<TitulacionLocal> {}
}
