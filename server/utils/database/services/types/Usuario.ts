import {
	makeKeyFunction,
	type AutoIncrement,
	type Defaults,
	type GetCreateType,
	type GetType,
	type Int,
	type PrimaryKey,
	type VarChar
} from './base/Shared';

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
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Usuario> {}
	export interface CreateData extends GetCreateType<Usuario> {}
}
