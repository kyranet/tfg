import type { AutoIncrement, Defaults, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface Usuario {
	id: PrimaryKey<AutoIncrement<Int>>;
	origin_login: VarChar<200>;
	origin_img: VarChar<200>;
	createdAt: Defaults<Date>;
	updatedAt: Defaults<Date>;
	terminos_aceptados: boolean;
}

export namespace Usuario {
	export const Name = 'usuario';

	export interface Value extends GetType<Usuario> {}
	export interface CreateData extends GetCreateType<Usuario> {}
}
