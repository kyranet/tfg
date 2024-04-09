import type { AutoIncrement, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface TitulacionLocal {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
}

export namespace TitulacionLocal {
	export const Name = 'titulacion_local';

	export interface Value extends GetType<TitulacionLocal> {}
	export interface CreateData extends GetCreateType<TitulacionLocal> {}
}
