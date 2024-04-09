import type { AutoIncrement, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface NecesidadSocial {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
}

export namespace NecesidadSocial {
	export const Name = 'necesidad_social';

	export interface Value extends GetType<NecesidadSocial> {}
	export interface CreateData extends GetCreateType<NecesidadSocial> {}
}
