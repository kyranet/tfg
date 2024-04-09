import type { AutoIncrement, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface Universidad {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<200>;
	provincia: VarChar<200>;
}

export namespace Universidad {
	export const Name = 'universidad';

	export interface Value extends GetType<Universidad> {}
	export interface CreateData extends GetCreateType<Universidad> {}
}
