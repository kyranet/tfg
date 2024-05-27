import { makeKeyFunction, type AutoIncrement, type GetCreateType, type GetType, type Int, type PrimaryKey, type VarChar } from './base/Shared';

export interface NecesidadSocial {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
}

export namespace NecesidadSocial {
	export const Name = 'necesidad_social';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<NecesidadSocial> {}
	export interface CreateData extends GetCreateType<NecesidadSocial> {}
}
